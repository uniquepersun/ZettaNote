import React, { useState, useRef, useEffect } from "react";
import { Container, Typography, IconButton, Box, Paper, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { API_URL } from "../../config";
import ReactMarkdown from "react-markdown";
import SharePageButton from "./sharePageButton";
import { FaTrashCan } from "react-icons/fa6";

// Always normalize page id for backend requests
const normalizePage = (page) => ({
    id: String(page?.id || page?._id),
    name: page?.name,
    content: page?.pageData,
});

export default function PageView({ page }) {
    const normalizedPage = normalizePage(page);
    const [content, setContent] = useState("");
    const [editing, setEditing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!normalizedPage.id) return;
        setLoading(true);
        setError("");
        const fetchPage = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(API_URL + "/api/pages/getpage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, pageId: normalizedPage.id }),
                });
                const data = await res.json();
                if (res.ok && data.Page) {
                    setContent(data.Page.pageData || "");
                } else {
                    setError(data.message || "Failed to load page");
                }
            } catch (err) {
                setError("Failed to load page");
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [normalizedPage.id]);

    const handleSave = async () => {
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API_URL + "/api/pages/savepage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    pageId: normalizedPage.id,
                    newPageData: content,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to save page");
                alert("Failed to save page ❌");
            } else {
                alert("Page saved ✅");
            }
        } catch (err) {
            setError("Failed to save page");
            alert("Failed to save page ❌");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API_URL + "/api/pages/deletepage", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, pageId: normalizedPage.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to delete page");
                alert("Failed to delete page");
            } else {
                alert("Page deleted");
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete page");
            alert("Failed to delete page");
        } finally {
            setLoading(false);
        }
    };


    const token = localStorage.getItem("token");

    return (
        <Container sx={{ mt: 8 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    {normalizedPage.name}
                </Typography>
                <IconButton color="primary" onClick={handleDelete} disabled={loading} >
                    <FaTrashCan />
                </IconButton>
                <IconButton color="primary" onClick={handleSave} disabled={loading}>
                    <SaveIcon />
                </IconButton>
                <SharePageButton token={token} pageId={normalizedPage.id} />
            </Box>
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <Paper
                sx={{
                    minHeight: "80vh",
                    border: "1px solid #ccc",
                    padding: 2,
                    borderRadius: 1,
                    background: "#fafbfc",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                }}
                onClick={() => setEditing(true)}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="78vh">
                        <CircularProgress />
                    </Box>
                ) : editing ? (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onBlur={() => setEditing(false)}
                        style={{
                            width: "100%",
                            minHeight: "78vh",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "1rem",
                            fontFamily: "inherit",
                            resize: "none",
                        }}
                        autoFocus
                    />
                ) : (
                    <div onClick={() => setEditing(true)}>
                        <ReactMarkdown>{content || "\\*Click to edit...\\*"}</ReactMarkdown>
                    </div>
                )}
            </Paper>
        </Container>
    );
}
