// src/pages/Landing.jsx
import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={4}
                sx={{
                    mt: 20,
                    p: 6,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Typography variant="h3" align="center">
                    Welcome to ZettaNote
                </Typography>
                <Typography variant="body1" align="center">
                    Organize your notes, collaborate, and stay productive.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/signup")}
                    >
                        Signup
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
