import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NewPagePopup from './newPagePopup';
import { ThemeToggleButton } from "./ThemeContext";

export default function HeaderBar({ onLogout, onNewPage }) {
    const [open, setOpen] = React.useState(false);

    const handleNewPage = () => {
        setOpen(true);
        if (onNewPage) onNewPage();
    };

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        ZettaNote
                    </Typography>
                    <Button color="inherit" onClick={handleNewPage}>
                        New Page
                    </Button>
                    <Button color="inherit" onClick={onLogout}>
                        Logout
                    </Button>
                    <ThemeToggleButton />

                </Toolbar>
            </AppBar>

            <NewPagePopup open={open} onClose={() => setOpen(false)} />
        </>
    );
}
