# main.py
import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
import uvicorn
import socket

# 환경변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# FastAPI 앱 초기화
app = FastAPI()


messages_list = []


@app.get("/")
async def root_page():
    return FileResponse("templates/index.html")

@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_page(path: str):
    if path == "":
        path = "index.html"
    
    file_path = os.path.join("templates", path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return "404 - 페이지를 찾을 수 없습니다."

@app.post("/chat")
async def chat_endpoint(message: dict):
    """채팅 엔드포인트"""
    try:
        if not messages_list:
            # 초기 시스템 프롬프트 설정
            with open('data/jshs-story.txt', 'r', encoding='utf-8') as f:
                messages_list.append({
                    "role": "system",
                    "content": f.read()
                })
                
        # 사용자 메시지 저장
        messages_list.append({
            "role": "user", 
            "content": message["message"]
        })
        
        # GPT 응답 생성
        response = client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=messages_list,
            temperature=0.7
        )
        
        # GPT 응답 저장
        assistant_message = response.choices[0].message.content
        messages_list.append({
            "role": "assistant", 
            "content": assistant_message
        })
        
        return {"response": assistant_message}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    hostname = socket.gethostname()
    HOST = socket.gethostbyname(hostname)
    PORT = 8080
    
    print(f"서버 시작: http://{HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)