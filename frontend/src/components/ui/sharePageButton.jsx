import React, { useState } from "react";
import {
  Button,
import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Typography
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { API_URL } from "../../config";

function SharePageButton({ token, pageId }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [giveWrite, setGiveWrite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [publicLink, setPublicLink] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setEmail("");
    setGiveWrite(false);
    setMessage("");
    setPublicLink("");
  Typography,
  Box,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ShareIcon from '@mui/icons-material/Share';
import { API_URL } from '../../config';
import { showToast } from '../../utils/toast';

function SharePageButton({ token, pageId }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [giveWrite, setGiveWrite] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
    setEmail('');
    setGiveWrite(false);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setPublicLink(""); 
  };

  // Share via email
  const handleShareEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/pages/sharepage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    const loadingToast = showToast.loading('Sharing page...');

    try {
      const res = await fetch(API_URL + '/api/pages/sharepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          pageId,
          userEmail: email,
          giveWritePermission: giveWrite,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Shared via email!");
    } catch {
      setMessage("Error sharing via email.");
    }

    setLoading(false);
  };

  // Share public link
  const handleShareLink = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/pages/publicshare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });

      const data = await res.json();

      if (data.publicShareId) {
        setPublicLink(`${API_URL}/api/pages/share/`+data.publicShareId);   
      }
      setMessage(data.message || "Public link generated!");
    } catch {
      setMessage("Error generating public link.");
    }

    setLoading(false);
  };

  const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(publicLink);
    setMessage("Link copied to clipboard!");
  } catch {
    setMessage("Failed to copy link.");
  }
};

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleOpen}
        sx={{ ml: 1 }}
      >
        Share
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share Page</DialogTitle>

        <DialogContent>
          <form onSubmit={handleShareEmail}>
      const data = await res.json();

      showToast.dismiss(loadingToast);

      if (res.ok) {
        showToast.success(`Page shared with ${email} successfully!`);
        handleClose();
      } else {
        showToast.error(data.message || 'Failed to share page');
      }
    } catch {
      showToast.dismiss(loadingToast);
      showToast.error('Error sharing page. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title="Share Page" arrow>
        <IconButton
          color="secondary"
          onClick={handleOpen}
          sx={{
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease',
            },
          }}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShareIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Share Page
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleShare}>
          <DialogContent sx={{ pb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
              }}
            >
              Share this page with another user by entering their email address.
            </Typography>

            <TextField
              label="User Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              placeholder="colleague@example.com"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={giveWrite}
                  onChange={(e) => setGiveWrite(e.target.checked)}
                />
              }
              label="Give edit permission"
            />

            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            {message && (
              <Typography
                color={message.includes("Error") ? "error" : "primary"}
                sx={{ mt: 1 }}
              >
                {message}
              </Typography>
            )}

            <DialogActions>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                Share via Email
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleShareLink}
                disabled={loading}
              >
                Share Public Link
              </Button>
              {publicLink && (
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyLink}
                    disabled={loading}
                  ></Button>
                )}
            </DialogActions>
          </form>
        </DialogContent>
                  sx={{ color: theme.palette.secondary.main }}
                />
              }
              label="Give edit permission"
              sx={{ mt: 2 }}
            />

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              {giveWrite
                ? 'This user will be able to view and edit the page'
                : 'This user will only be able to view the page'}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <LoadingButton
              onClick={handleClose}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
              }}
            >
              Share Page
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default SharePageButton;
