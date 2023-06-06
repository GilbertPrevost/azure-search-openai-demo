import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

const Layout = () => {
    const bannerImageUrl = "Image-1_banner_1920x400-ModelShort.jpg";
    return (
        <div className="flex flex-col h-screen">
            {/* <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>GPT + Enterprise data | Sample</h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask a question
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://aka.ms/entgptsearch" target={"_blank"} title="Github repository link">
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label="Link to github repository"
                                        width="20px"
                                        height="20px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>Azure OpenAI + Cognitive Search</h4>
                </div>
            </header> */}

            <header
                className={`w-full h-100 ${bannerImageUrl ? "bg-cover bg-center bg-no-repeat" : ""}`}
                style={bannerImageUrl ? { backgroundImage: `url(${bannerImageUrl})` } : {}}
            >
                <div className="w-full h-24 bg-black bg-opacity-25 flex items-center justify-center">
                    <div className={styles.logoDiv}>
                        <img src="TU-Logo-wht.png" alt="logo" className={styles.logoImg} />
                    </div>
                    <div className={styles.titleDiv}>
                        <svg width="900" height="100" xmlns="http://www.w3.org/2000/svg">
                            <text
                                x="70%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#3b82f6"
                                style={{
                                    fontFamily: "Futura, Arial, sans-serif",
                                    fontWeight: "bold",
                                    fontSize: "72px"
                                }}
                            >
                                AI Assistant
                            </text>
                        </svg>
                    </div>
                </div>
            </header>
     
            

            <Outlet />
        </div>
    );
};

export default Layout;
