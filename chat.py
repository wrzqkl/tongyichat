import streamlit as st
from openai import OpenAI

st.set_page_config(
    page_title="三亚学院智能助手",
    page_icon="🤖",
    layout="centered"
)
st.markdown("""<style>
    .stApp {
        max-width: 1000px;  /* 限制应用最大宽度为1000像素 */
        margin: 0 auto;  /* 设置水平居中 */
    }
    
    /* 隐藏Streamlit默认的菜单和页脚,使界面更简洁 */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* 设置标题居中显示，并使用深灰蓝色 */
    h1 {
        text-align: center;
        color: #1a2a3a;
    }
    
    /* 设置副标题样式，使用灰色并添加底部间距 */
    .subtitle {
        text-align: center;
        color: #6b7280;
        margin-bottom: 2rem;
    }
</style>""", unsafe_allow_html=True)    

def create_openai_client():
    return OpenAI(
        api_key="sk-e1c7036f643f439e9b223fcb41fa3649",  # 设置API密钥
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",  # 指向阿里云通义千问的API地址
        timeout=180.0,  # 设置超时时间为180秒，防止长时间等待响应
    )

if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "你好！我是三亚学院的智能助手，基于阿里云通义千问大模型。请问有什么我可以帮助你的吗？"
        }
    ]

if "openai_client" not in st.session_state:
    st.session_state.openai_client = create_openai_client()
st.title("🤖 三亚学院智能聊天助手")
st.markdown('<p class="subtitle">基于阿里云通义千问大模型</p>', unsafe_allow_html=True)
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
         st.markdown(message["content"])
if prompt := st.chat_input("在这里输入你的问题..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    with st.chat_message("assistant"):
        with st.spinner("思考中..."):
            try:
                response = st.session_state.openai_client.chat.completions.create(
                    model="qwen-plus",
                    messages=[
                        {
                            "role": "system", 
                            "content": "你是三亚学院的智能助手，表现得友好、专业且乐于助人。",
                        },
                        *[
                            {"role": m["role"], "content": m["content"]}
                            for m in st.session_state.messages
                        ],
                    ],
                    temperature=0.7,
                    max_tokens=2000,
                )
                ai_response = response.choices[0].message.content
                st.markdown(ai_response)
                st.session_state.messages.append(
                    {"role": "assistant", "content": ai_response}
                )
            except Exception as e:
                st.error(f"抱歉，发生了错误: {str(e)}")