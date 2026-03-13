import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Fab,
  Box,
  InputBase,
  Badge,
  CircularProgress,
  styled,
} from '@mui/material';
import { MessageSquarePlus, Search } from 'lucide-react';
import { insforge } from '../lib/insforge'; // Import your InsForge client

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 7,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        // Assuming you have a 'conversations' table
        const { data, error } = await insforge.db.select('conversations');
        if (error) throw error;
        setChats(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <Box sx={{ pb: 7, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2, pb: 1 }}>
        <Toolbar>
          <SearchContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search conversations..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchContainer>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
           <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
             Error: {error}
           </Typography>
        )}
        {!loading && !error && (
          <List>
            {chats.map((chat) => (
              <ListItem button key={chat.id}>
                <ListItemAvatar>
                  {/* Use a real avatar_url from your data */}
                  <Avatar alt={chat.name} src={chat.avatar_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body1">{chat.name}</Typography>}
                  /* Use a real last_message field */
                  secondary={<Typography variant="body2" color="text.secondary">{chat.last_message}</Typography>}
                />
                {chat.unread_count > 0 && (
                  <Badge badgeContent={chat.unread_count} color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Fab color="primary" aria-label="add" sx={{ position: 'absolute', bottom: 16, right: 16 }}>
        <MessageSquarePlus />
      </Fab>
    </Box>
  );
};

export default ChatListScreen;
