4 terminals:
1) ollama run gemma:2b
2)cd frontend
3)backend
4)for git push

zenith cortex
backend>
     config>
           vertex-key.json
     routes>
           achievements.js
           auth.js
           home.js
           leaderboard.js
           search.js
           quiz.js
           resume.js
     utils>
           db.js
           vertex.js
     .env
     db.json
     nodemon.json
     server.js

frontend>
    src>
       components>
       AssistantDrawer.jsx
       Navbar.jsx
       Sidebar.jsx
    context>
       AuthContext.jsx
    data>
       achievements.js
       quiz.questions.json
    layouts>
       MainLayout.jsx
    pages> 
       Home.jsx
       Leaderboard.jsx
       Login.jsx
       MentorHub.jsx
       Profile.jsx
       Quiz.jsx
       RecHome.jsx
       RecProfile.jsx
       RecQuiz.jsx
       Resume.jsx
    App.jsx