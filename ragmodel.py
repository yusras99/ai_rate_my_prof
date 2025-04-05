from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader, WebBaseLoader, YoutubeLoader, DirectoryLoader, TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.metrics.pairwise import cosine_similarity
from langchain_pinecone import PineconeVectorStore
import os
import tiktoken
os.environ["TOKENIZERS_PARALLELISM"] = "false"


from fastapi import FastAPI

from pydantic import BaseModel, AnyHttpUrl


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class RequestBody(BaseModel):
    url: AnyHttpUrl

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/get-prof-data/")
async def get_data(user_url: RequestBody):


    # Initializes a WebBaseLoader to scrape or load data from the provided URL.
    # Commented out because only need to be run once
    # loader = WebBaseLoader("https://www.ratemyprofessors.com/professor/2533741")
    loader = WebBaseLoader(str(user_url.url))
    review_data = loader.load()

    print(review_data)

    # Sets up a tokenizer using the p50k_base encoding to tokenize the text data, which helps in splitting the text into manageable pieces.
    tokenizer = tiktoken.get_encoding('p50k_base')

    # Defines a function to calculate the length of a text in terms of tokens, which is useful for deciding how to split the text.
    def tiktoken_len(text):
        tokens = tokenizer.encode(
            text,
            disallowed_special=()
        )
        return len(tokens)

    text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=100,
            length_function=tiktoken_len,
            separators=["\n\n", "\n", " ", ""]
    )

    # Splits the loaded review data into smaller chunks of text according to the specified chunk size and overlap.
    # Process and split the reviews
    texts = text_splitter.split_documents(review_data)
    print(texts)

    # initialize the pinecone to use it
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = "rag"
    namespace = "rmp-krishna"

    # Commented out because only need to be run once
    # Create the index to store the embeddings
    # pc.create_index(
    #     name=index_name,
    #     dimension=384, #dimensions for huggingface multilingual model embeddings
    #     metric="cosine",
    #     spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    # )
    index = pc.Index(index_name)
    # SentenceTransformer provides an easy interface for working with pre-trained models for transforming sentences into embeddings.
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    # vectorstore = PineconeVectorStore(index=index, embedding=embeddings)
    vectorstore_from_texts = PineconeVectorStore.from_texts([f"Source: {t.metadata['source']}, Title: {t.metadata['title']} \n\nContent: {t.page_content}" for t in texts], embeddings, index_name=index_name, namespace=namespace)

    for document in texts:
        print("\n\n\n\n----")

        print(document.metadata, document.page_content)

        print('\n\n\n\n----')


    response_data = {
        "success": True,
        "message": "Data loaded successfully",
    }
    return response_data



# get_data("https://www.ratemyprofessors.com/professor/2533741")
