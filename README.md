<div align="center">

![ZettaNote Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,18,24&height=200&section=header&text=ZettaNote&fontSize=80&fontAlignY=35&animation=fadeIn&fontColor=fff)

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=24&duration=3000&pause=1000&color=4ADE80&center=true&vCenter=true&width=600&lines=Markdown-powered+note+taking;Real-time+collaboration;Open+source+%26+developer+friendly)](https://zettanote.tech)

[![License](https://img.shields.io/github/license/braydenidzenga/zettanote?style=flat-square&color=4ade80)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/braydenidzenga/zettanote?style=flat-square&color=f59e0b)](https://github.com/braydenidzenga/zettanote/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/braydenidzenga/zettanote?style=flat-square&color=3b82f6)](https://github.com/braydenidzenga/zettanote/pulls)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://zettanote.tech)

**An open-source note-taking application** inspired by Notion, focusing on **Markdown-based notes**, **real-time collaboration**, and **flexible organization** while remaining lightweight and developer-friendly.

[Features](#-planned-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Docker](#-running-with-docker) • [Contributing](#-contributing)

</div>

---

## 🚧 Project Status

<div align="center">

**Currently in Active Development** • Contributions Welcome!

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-ff6b6b?style=for-the-badge&logo=hacktoberfest)](https://hacktoberfest.com)

</div>

---

## ✨ Planned Features

<div align="center">

**[View Full Feature Roadmap on ZettaNote →](https://zettanote.tech/share/7ac81567-c0e7-4286-94f7-5596a3fe07a1)**

</div>

Core functionality being developed:

- **Markdown Editor** with live preview
- **Real-time Collaboration** for teams
- **Flexible Organization** with tags and folders
- **Search & Filter** across all notes
- **Export Options** (PDF, HTML, Markdown)
- **Dark Mode** support

---

## 🛠️ Tech Stack

<div align="center">

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

### DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

</div>

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

---

### 🔧 Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/braydenidzenga/zettanote.git
   cd ZettaNote/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy .env.example to .env and fill in your variables
   cp .env.example .env
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

#### 📮 Test APIs with Postman

1. Open **Postman**
2. Click **Import**
3. Select `backend/docs/postman_collection.json`
4. Start testing endpoints (ensure backend is running at `http://localhost:5000`)

---

### 🎨 Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ZettaNote/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update configuration**

   ```bash
   # Edit config.js to point to your backend instance
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

---

### 🔐 Admin Portal Setup (Optional)

1. **Install dependencies**

   ```bash
   cd admin-portal
   npm install
   ```

2. **Configure environment**

   ```bash
   # Copy .env.example to .env and edit variables
   cp .env.example .env
   ```

3. **Run the admin portal**

   ```bash
   npm start
   ```

4. **Create default admin user**
   ```bash
   cd ZettaNote/backend
   node createFirstAdmin.js
   ```

---

## 🐳 Running with Docker

### Prerequisites

- **Docker** installed
- **MongoDB** instance (local or cloud)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/braydenidzenga/zettanote.git
   cd ZettaNote
   ```

2. **Configure environment variables**

   ```bash
   # Backend: Modify variables in backend/Dockerfile
   # Frontend: Update config.js to point to your backend
   ```

3. **Build Docker images**

   ```bash
   docker build -t zettanote-backend ./backend
   docker build -t zettanote-frontend ./frontend
   ```

4. **Run containers**
   ```bash
   docker run -d -p 5000:5000 --name zettanote-backend zettanote-backend
   docker run -d -p 3000:3000 --name zettanote-frontend zettanote-frontend
   ```

---

## 🤝 Contributing

<div align="center">

We welcome contributions from the community!

[![Contributors](https://img.shields.io/github/contributors/braydenidzenga/zettanote?style=for-the-badge&color=4ade80)](https://github.com/braydenidzenga/zettanote/graphs/contributors)

</div>

**Ways to Contribute:**

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## Contributors

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/RabindranathChanda">
                    <img src="https://avatars.githubusercontent.com/u/116186121?v=4" width="100;" alt="RabindranathChanda"/>
                    <br />
                    <sub><b>RabindranathChanda</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MannuVilasara">
                    <img src="https://avatars.githubusercontent.com/u/117009138?v=4" width="100;" alt="MannuVilasara"/>
                    <br />
                    <sub><b>MannuVilasara</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/braydenidzenga">
                    <img src="https://avatars.githubusercontent.com/u/156542384?v=4" width="100;" alt="braydenidzenga"/>
                    <br />
                    <sub><b>braydenidzenga</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ikeshav26">
                    <img src="https://avatars.githubusercontent.com/u/203427446?v=4" width="100;" alt="ikeshav26"/>
                    <br />
                    <sub><b>ikeshav26</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/codingniket">
                    <img src="https://avatars.githubusercontent.com/u/115335243?v=4" width="100;" alt="codingniket"/>
                    <br />
                    <sub><b>codingniket</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/rahilraipuria">
                    <img src="https://avatars.githubusercontent.com/u/168921906?v=4" width="100;" alt="rahilraipuria"/>
                    <br />
                    <sub><b>rahilraipuria</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/SudharsanSaravanan">
                    <img src="https://avatars.githubusercontent.com/u/149818412?v=4" width="100;" alt="SudharsanSaravanan"/>
                    <br />
                    <sub><b>SudharsanSaravanan</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/deepshikhatutorials">
                    <img src="https://avatars.githubusercontent.com/u/233038862?v=4" width="100;" alt="deepshikhatutorials"/>
                    <br />
                    <sub><b>deepshikhatutorials</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/kaushalyap">
                    <img src="https://avatars.githubusercontent.com/u/24698778?v=4" width="100;" alt="kaushalyap"/>
                    <br />
                    <sub><b>kaushalyap</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/damarudhvarma">
                    <img src="https://avatars.githubusercontent.com/u/138239688?v=4" width="100;" alt="damarudhvarma"/>
                    <br />
                    <sub><b>damarudhvarma</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/arunesh12389">
                    <img src="https://avatars.githubusercontent.com/u/212670878?v=4" width="100;" alt="arunesh12389"/>
                    <br />
                    <sub><b>arunesh12389</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/anup2702">
                    <img src="https://avatars.githubusercontent.com/u/97333000?v=4" width="100;" alt="anup2702"/>
                    <br />
                    <sub><b>anup2702</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/madhavv-xd">
                    <img src="https://avatars.githubusercontent.com/u/172715681?v=4" width="100;" alt="madhavv-xd"/>
                    <br />
                    <sub><b>madhavv-xd</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/SrinjoyeeDey">
                    <img src="https://avatars.githubusercontent.com/u/178504847?v=4" width="100;" alt="SrinjoyeeDey"/>
                    <br />
                    <sub><b>SrinjoyeeDey</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Er-luffy-D">
                    <img src="https://avatars.githubusercontent.com/u/70336252?v=4" width="100;" alt="Er-luffy-D"/>
                    <br />
                    <sub><b>Er-luffy-D</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Omar8345">
                    <img src="https://avatars.githubusercontent.com/u/68811721?v=4" width="100;" alt="Omar8345"/>
                    <br />
                    <sub><b>Omar8345</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Nitin2332">
                    <img src="https://avatars.githubusercontent.com/u/175546686?v=4" width="100;" alt="Nitin2332"/>
                    <br />
                    <sub><b>Nitin2332</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Namit-Rana6">
                    <img src="https://avatars.githubusercontent.com/u/146658481?v=4" width="100;" alt="Namit-Rana6"/>
                    <br />
                    <sub><b>Namit-Rana6</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/sudoyasir">
                    <img src="https://avatars.githubusercontent.com/u/94890956?v=4" width="100;" alt="sudoyasir"/>
                    <br />
                    <sub><b>sudoyasir</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mukeshdhadhariya">
                    <img src="https://avatars.githubusercontent.com/u/163722787?v=4" width="100;" alt="mukeshdhadhariya"/>
                    <br />
                    <sub><b>mukeshdhadhariya</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/siddxharth1">
                    <img src="https://avatars.githubusercontent.com/u/91618085?v=4" width="100;" alt="siddxharth1"/>
                    <br />
                    <sub><b>siddxharth1</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/matheusdcunha">
                    <img src="https://avatars.githubusercontent.com/u/91388782?v=4" width="100;" alt="matheusdcunha"/>
                    <br />
                    <sub><b>matheusdcunha</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/manumay1962">
                    <img src="https://avatars.githubusercontent.com/u/132794868?v=4" width="100;" alt="manumay1962"/>
                    <br />
                    <sub><b>manumay1962</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mahenoorsalat">
                    <img src="https://avatars.githubusercontent.com/u/167444338?v=4" width="100;" alt="mahenoorsalat"/>
                    <br />
                    <sub><b>mahenoorsalat</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/AsadAhmedSaiyed">
                    <img src="https://avatars.githubusercontent.com/u/166991578?v=4" width="100;" alt="AsadAhmedSaiyed"/>
                    <br />
                    <sub><b>AsadAhmedSaiyed</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/21aansh06">
                    <img src="https://avatars.githubusercontent.com/u/178574389?v=4" width="100;" alt="21aansh06"/>
                    <br />
                    <sub><b>21aansh06</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

---

## 📄 License

<div align="center">

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

[![License](https://img.shields.io/badge/License-MIT-4ade80?style=for-the-badge)](./LICENSE)

</div>

---

## 💚 Support

<div align="center">

If you find ZettaNote helpful, please consider giving it a ⭐️ on GitHub!

[![Star on GitHub](https://img.shields.io/github/stars/braydenidzenga/zettanote?style=social)](https://github.com/braydenidzenga/zettanote)

**Built with 💚 by the open-source community**

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,18,24&height=100&section=footer)

</div>
