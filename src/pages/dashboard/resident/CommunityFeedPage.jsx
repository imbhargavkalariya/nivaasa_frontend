import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { residentApi } from 'src/api/nivaasa';
import { useAuthContext } from 'src/auth/hooks';

export default function CommunityFeedPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCommentIndex, setOpenCommentIndex] = useState(null); // which post id is open for comment
  const [commentText, setCommentText] = useState('');
  
  // Forms
  const [form, setForm] = useState({
    type: 'DISCUSSION',
    title: '',
    content: '',
    price: 0,
    eventDate: '',
  });

  const [pollOpts, setPollOpts] = useState(['', '']);

  const fetchFeed = async () => {
    try {
      const res = await residentApi.getFeed();
      if (res.success) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch community feed', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('title', form.title);
      formData.append('content', form.content);
      
      if (form.type === 'BUY_SELL') {
        formData.append('price', form.price);
      }
      if (form.type === 'EVENT') {
        formData.append('eventDate', form.eventDate);
      }
      if (form.type === 'POLL') {
        const filteredOpts = pollOpts.filter((opt) => opt.trim() !== '');
        formData.append('pollOptions', JSON.stringify(filteredOpts));
      }

      const res = await residentApi.createPost(formData);
      if (res.success) {
        enqueueSnackbar('Message posted successfully to feed!', { variant: 'success' });
        setOpenCreate(false);
        setPollOpts(['', '']);
        setForm({ type: 'DISCUSSION', title: '', content: '', price: 0, eventDate: '' });
        fetchFeed();
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Error posting message', { variant: 'error' });
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await residentApi.likePost(id);
      if (res.success) {
        fetchFeed(); // refresh likes count
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (postId, optId) => {
    try {
      const res = await residentApi.votePoll(postId, optId);
      if (res.success) {
        enqueueSnackbar('Vote registered', { variant: 'success' });
        fetchFeed();
      }
    } catch (err) {
      enqueueSnackbar('Failed to vote', { variant: 'error' });
    }
  };

  const handleAddComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      const res = await residentApi.commentPost(id, commentText);
      if (res.success) {
        setCommentText('');
        fetchFeed();
      }
    } catch (err) {
      enqueueSnackbar('Error adding comment', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      const res = await residentApi.deletePost(id);
      if (res.success) {
        enqueueSnackbar('Post deleted successfully', { variant: 'success' });
        fetchFeed();
      }
    } catch (err) {
      enqueueSnackbar('Failed to delete post', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Community Board</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Interact with neighbors. Vote in polls, browse sell listings, and view upcoming events.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:pen-new-square-bold" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Create Post
        </Button>
      </Box>

      {/* Feed List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        {posts.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid #E5EAF2' }}>
            <Typography variant="body1" color="text.secondary">No postings in your community feed yet.</Typography>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id} sx={{ borderRadius: '16px', border: '1px solid #E5EAF2', overflow: 'visible' }}>
              <CardHeader
                avatar={
                  <Avatar src={post.authorId?.profilePhoto}>
                    {post.authorId?.name?.slice(0, 1).toUpperCase()}
                  </Avatar>
                }
                action={
                  post.authorId?._id === user?.id && (
                    <IconButton onClick={() => handleDelete(post._id)} color="error">
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  )
                }
                title={post.authorId?.name}
                subheader={`${post.authorId?.role?.replace('_', ' ')} - ${new Date(post.createdAt).toLocaleDateString()}`}
              />
              <CardContent sx={{ pt: 1, pb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>{post.title}</Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip label={post.type} size="small" sx={{ mr: 1, fontWeight: 'bold' }} color="primary" variant="outlined" />
                  {post.type === 'BUY_SELL' && post.price && (
                    <Chip label={`₹${post.price}`} size="small" color="success" />
                  )}
                  {post.type === 'EVENT' && post.eventDate && (
                    <Chip label={`Event Date: ${new Date(post.eventDate).toLocaleDateString()}`} size="small" color="warning" />
                  )}
                </Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', mb: 2 }}>{post.content}</Typography>

                {/* Poll Options rendering */}
                {post.type === 'POLL' && post.pollOptions?.length > 0 && (
                  <Box sx={{ mt: 2, p: 2.5, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Vote / Selection Options</Typography>
                    {post.pollOptions.map((opt) => {
                      const userVoted = opt.votes.includes(user?.id);
                      return (
                        <Button
                          key={opt._id}
                          fullWidth
                          variant={userVoted ? 'contained' : 'outlined'}
                          onClick={() => handleVote(post._id, opt._id)}
                          sx={{ mb: 1.5, justifyContent: 'space-between', borderRadius: '8px', textTransform: 'none' }}
                        >
                          <span>{opt.optionText}</span>
                          <span style={{ fontWeight: 'bold' }}>{opt.votes.length} votes</span>
                        </Button>
                      );
                    })}
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ borderTop: '1px solid #E5EAF2', px: 2, py: 1, backgroundColor: '#F8FAFC', borderRadius: '0 0 16px 16px' }}>
                <Button startIcon={<Iconify icon={post.likes?.includes(user?.id) ? 'solar:heart-bold' : 'solar:heart-linear'} sx={{ color: post.likes?.includes(user?.id) ? 'red' : 'inherit' }} />} onClick={() => handleLike(post._id)}>
                  Like ({post.likes?.length || 0})
                </Button>
                <Button startIcon={<Iconify icon="solar:chat-round-dots-linear" />} onClick={() => setOpenCommentIndex(openCommentIndex === post._id ? null : post._id)}>
                  Comments ({post.comments?.length || 0})
                </Button>
              </CardActions>

              {/* Comments Feed Panel */}
              {openCommentIndex === post._id && (
                <Box sx={{ px: 3, pb: 3, borderTop: '1px solid #E5EAF2', pt: 2 }}>
                  <List sx={{ maxH: '200px', overflowY: 'auto', mb: 2 }}>
                    {post.comments?.map((c, idx) => (
                      <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
                        <ListItemText
                          primary={c.text}
                          secondary={`${c.authorId?.name || 'Resident'} - ${new Date(c.createdAt).toLocaleDateString()}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField fullWidth size="small" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                    <Button variant="contained" onClick={() => handleAddComment(post._id)}>Comment</Button>
                  </Box>
                </Box>
              )}
            </Card>
          ))
        )}
      </Box>

      {/* Create Post Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Write Community Post</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Post Category</InputLabel>
                <Select value={form.type} label="Post Category" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <MenuItem value="DISCUSSION">Discussion Board</MenuItem>
                  <MenuItem value="POLL">Create a Poll</MenuItem>
                  <MenuItem value="BUY_SELL">Buy & Sell classified</MenuItem>
                  <MenuItem value="EVENT">Society Event</MenuItem>
                  <MenuItem value="HELP_REQUEST">Neighbourhood Assistance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Post Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Grid>

            {form.type === 'BUY_SELL' && (
              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Price (INR)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
              </Grid>
            )}

            {form.type === 'EVENT' && (
              <Grid item xs={12}>
                <TextField fullWidth type="date" label="Event Date" InputLabelProps={{ shrink: true }} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Post Description Content" placeholder="Type what you'd like to share..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </Grid>

            {form.type === 'POLL' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Poll Options</Typography>
                {pollOpts.map((opt, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                    <TextField fullWidth size="small" label={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                      const arr = [...pollOpts];
                      arr[idx] = e.target.value;
                      setPollOpts(arr);
                    }} />
                    {pollOpts.length > 2 && (
                      <IconButton color="error" onClick={() => {
                        const arr = [...pollOpts];
                        arr.splice(idx, 1);
                        setPollOpts(arr);
                      }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button size="small" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setPollOpts([...pollOpts, ''])}>
                  Add Option
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Publish Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
