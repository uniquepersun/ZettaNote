import React, { useEffect, useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import { API_URL } from "../../config";

export default function Sidebar({ token, onSelectPage }) {
    const [ownedPages, setOwnedPages] = useState([]);
    const [sharedPages, setSharedPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            try {
                const res = await fetch(API_URL + "/api/pages/getpages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();
                setOwnedPages(data.OwnedPages || []);
                setSharedPages(data.SharedPages || []);
            } catch (err) {
                console.error("Failed to fetch pages:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [token]);

    // Normalize page object for frontend
    const normalizePage = (page) => ({
        id: String(page.id || page._id),
        name: page.name,
        content: page.pageData,
    });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: 240,
                    boxSizing: "border-box",
                    top: 64,
                    height: "calc(100% - 64px)",
                },
            }}
        >
            <List>
                <Typography key="owned-heading" variant="h6" sx={{ pl: 2, pt: 2 }}>
                    Your Pages
                </Typography>
                <Divider key="owned-divider" />
                {loading && (
                    <Typography key="owned-loading" sx={{ pl: 2, pt: 1 }}>
                        Loading...
                    </Typography>
                )}
                {!loading && ownedPages.length === 0 && (
                    <Typography key="owned-empty" sx={{ pl: 2, pt: 1 }}>
                        No pages yet
                    </Typography>
                )}
                {!loading &&
                    ownedPages.length > 0 &&
                    ownedPages.map((page) => {
                        const normalized = normalizePage(page);
                        return (
                            <ListItemButton
                                key={normalized.id}
                                onClick={() => onSelectPage(normalized)}
                            >
                                <ListItemText primary={normalized.name} />
                            </ListItemButton>
                        );
                    })}

                <Typography key="shared-heading" variant="h6" sx={{ pl: 2, pt: 3 }}>
                    Shared With You
                </Typography>
                <Divider key="shared-divider" />
                {loading && (
                    <Typography key="shared-loading" sx={{ pl: 2, pt: 1 }}>
                        Loading...
                    </Typography>
                )}
                {!loading && sharedPages.length === 0 && (
                    <Typography key="shared-empty" sx={{ pl: 2, pt: 1 }}>
                        No shared pages
                    </Typography>
                )}
                {!loading &&
                    sharedPages.length > 0 &&
                    sharedPages.map((page) => {
                        const normalized = normalizePage(page);
                        return (
                            <ListItemButton
                                key={normalized.id}
                                onClick={() => onSelectPage(normalized)}
                            >
                                <ListItemText primary={normalized.name} />
                            </ListItemButton>
                        );
                    })}
            </List>
        </Drawer>
    );
}
