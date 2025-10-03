import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/sidebar";
import HeaderBar from "../components/ui/headerbar";
import PageView from "../components/ui/pageView";
import { Typography } from "@mui/material";
import { ThemeToggleButton } from "../components/ui/ThemeContext";
import { useEffect } from "react";
import { API_URL } from "../config";

export default function Home() {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        const getUser = async () => {
            try {
                const res = await fetch(API_URL+"/api/auth/getuser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token })
                });
                const data = await res.json();
                if (res.ok && data.user) {
                    setName(data.user.name);
                } else {
                    navigate("/");
                }
            } catch (err) {
                navigate("/");
            }
        }

        getUser();
    });


    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const onCreatePage = () => {
        console.log("onCreatePage");
    };

    const onSelectPage = (page) => {
        setSelectedPage(page);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <HeaderBar onLogout={onLogout} onNewPage={onCreatePage} />

            <div style={{ display: "flex", flexGrow: 1 }}>
                <Sidebar
                    token={localStorage.getItem("token")}
                    onSelectPage={onSelectPage}
                />

                <main style={{ flexGrow: 1, padding: "16px" }}>
                    {selectedPage ? (
                        <PageView page={selectedPage} />
                    ) : (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Select a page to view or edit
                        </Typography>
                    )}
                </main>
            </div>
        </div>
    );
}
