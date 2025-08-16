import React, { useState, useEffect } from "react";
import VideoList from "../videoList";
import VideoPlayer from "../Components/VideoPlayer";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  Divider,
  List,
  Box,
  Paper,
  Container,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Badge,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Fab
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Menu,
  Search,
  Notifications,
  AccountCircle,
  PlayCircleOutline,
  WatchLater,
  CheckCircle,
  Star,
  StarBorder,
  Bookmark,
  Share,
  Download,
  ClosedCaption
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const Root = styled("div")({
  display: "flex",
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
});

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1e40af 100%)`,
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  backdropFilter: "blur(8px)",
}));

const SearchContainer = styled("div")(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: 340,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 340,
    borderRight: "none",
    background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.common.white,
    boxShadow: "4px 0 20px -10px rgba(0,0,0,0.2)",
  },
}));

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: "80px",
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: "70px",
  },
}));

const VideoContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  paddingBottom: "56.25%", // 16:9 aspect ratio
  height: 0,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
  backgroundColor: "#000",
  marginBottom: theme.spacing(3),
  "&:hover": {
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  },
  transition: "all 0.3s ease",
}));

const ProgressContainer = styled("div")({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
});

const CourseProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  "& .MuiLinearProgress-bar": {
    borderRadius: 3,
    background: `linear-gradient(90deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

const StyledListItem = styled("div")(({ selected, theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  transition: "all 0.2s ease",
  cursor: "pointer",
  background: selected 
    ? `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.4)} 100%)` 
    : "transparent",
  color: selected ? theme.palette.common.white : "inherit",
  "&:hover": {
    background: selected 
      ? alpha(theme.palette.secondary.main, 0.5) 
      : alpha(theme.palette.common.white, 0.1),
    transform: "translateX(4px)",
  },
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1.5),
  borderLeft: selected ? `4px solid ${theme.palette.secondary.main}` : "none",
}));

const RatingContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[4],
  },
  margin: theme.spacing(0, 1),
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: theme.zIndex.speedDial,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
  transition: 'all 0.2s ease',
}));

function Videos() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Simulate course progress
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        return Math.min(oldProgress + Math.random() * 10, 100);
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <CssBaseline />

        {/* App Bar */}
        <CustomAppBar position="fixed">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              letterSpacing: '-0.025em',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              ProReact Masterclass
            </Typography>
            
            <SearchContainer>
              <IconButton color="inherit" sx={{ p: '10px' }}>
                <Search />
              </IconButton>
            </SearchContainer>
            
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <IconButton color="inherit" sx={{ mx: 0.5 }}>
                <Badge badgeContent={3} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ ml: 0.5 }}>
                <AccountCircle sx={{ fontSize: '32px' }} />
              </IconButton>
            </Box>
          </Toolbar>
        </CustomAppBar>

        {/* Sidebar */}
        <SidebarDrawer
          variant={isMobile ? "temporary" : "permanent"}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <Toolbar /> {/* Spacer for app bar */}
          <Box p={3} sx={{ pt: 2 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 2,
                  bgcolor: theme.palette.secondary.main,
                  boxShadow: theme.shadows[4],
                }}
              >
                CS
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Advanced React 2024</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  by Code School
                </Typography>
              </Box>
            </Box>
            
            <Box mb={3} sx={{ backgroundColor: alpha(theme.palette.common.white, 0.1), p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Course Progress</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{Math.round(progress)}%</Typography>
              </Box>
              <CourseProgress variant="determinate" value={progress} />
            </Box>
            
            <Box display="flex" gap={1} mb={3}>
              <Chip 
                icon={<PlayCircleOutline fontSize="small" />} 
                label="15 Lessons" 
                size="small" 
                sx={{ 
                  background: alpha(theme.palette.common.white, 0.1),
                  color: theme.palette.common.white,
                }} 
              />
              <Chip 
                icon={<WatchLater fontSize="small" />} 
                label="6 Hours" 
                size="small"
                sx={{ 
                  background: alpha(theme.palette.common.white, 0.1),
                  color: theme.palette.common.white,
                }} 
              />
            </Box>
          </Box>
          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.15)", mx: 2 }} />

          {/* Video List */}
          <List sx={{ overflowY: 'auto', height: 'calc(100vh - 240px)', px: 1 }}>
            <VideoList
              onVideoSelect={handleVideoSelect}
              itemComponent={({ video, isSelected }) => (
                <StyledListItem selected={isSelected}>
                  <Box mr={2} sx={{ minWidth: 24 }}>
                    {video.completed ? (
                      <CheckCircle color="inherit" fontSize="small" />
                    ) : (
                      <PlayCircleOutline color="inherit" fontSize="small" />
                    )}
                  </Box>
                  <Box flexGrow={1} sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap>{video.title}</Typography>
                    <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                      {video.duration} min • {video.views} views
                    </Typography>
                  </Box>
                  {video.isNew && (
                    <Chip 
                      label="New" 
                      color="secondary" 
                      size="small" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                      }} 
                    />
                  )}
                </StyledListItem>
              )}
            />
          </List>
        </SidebarDrawer>

        {/* Main Content */}
        <Content sx={{ 
          marginLeft: !isMobile && sidebarOpen ? '340px' : 0,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}>
          <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
            {/* Video Player Area */}
            <Box sx={{ px: { xs: 0, sm: 0 } }}>
              <VideoContainer elevation={3}>
                {selectedVideo ? (
                  <>
                    <VideoPlayer videoData={selectedVideo} />
                    <ProgressContainer>
                      <CourseProgress variant="determinate" value={progress} />
                    </ProgressContainer>
                  </>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    bgcolor="#000"
                    color="#fff"
                    textAlign="center"
                    p={3}
                  >
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Welcome to Your Course Dashboard
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        Select a video lesson from the sidebar to get started
                      </Typography>
                    </Box>
                  </Box>
                )}
              </VideoContainer>
            </Box>

            {/* Video Description */}
            {selectedVideo && (
              <Paper elevation={0} sx={{ 
                padding: 3, 
                mb: 3, 
                borderRadius: 3,
                border: `1px solid ${theme.palette.grey[200]}`,
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      letterSpacing: '-0.025em',
                    }}>
                      {selectedVideo.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <RatingContainer>
                        {[1, 2, 3, 4, 5].map((star) => (
                          selectedVideo.rating >= star ? 
                            <Star key={star} color="secondary" fontSize="small" /> : 
                            <StarBorder key={star} color="secondary" fontSize="small" />
                        ))}
                        <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.8 }}>
                          ({selectedVideo.ratingCount || 124} ratings)
                        </Typography>
                      </RatingContainer>
                      <Typography variant="caption" sx={{ 
                        backgroundColor: theme.palette.grey[200],
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}>
                        {selectedVideo.difficulty || "Intermediate"} level
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex">
                    <ActionButton aria-label="bookmark">
                      <Bookmark fontSize="small" />
                    </ActionButton>
                    <ActionButton aria-label="share">
                      <Share fontSize="small" />
                    </ActionButton>
                    <ActionButton aria-label="download">
                      <Download fontSize="small" />
                    </ActionButton>
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph sx={{ 
                  mb: 3,
                  lineHeight: 1.7,
                  color: theme.palette.text.secondary,
                }}>
                  {selectedVideo.description ||
                    "This comprehensive lesson dives deep into modern React patterns and best practices. You'll learn through hands-on examples and real-world applications, with a focus on performance optimization and clean code architecture."}
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {selectedVideo.tags?.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.palette.grey[100],
                        fontWeight: 500,
                      }} 
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box display="flex" flexWrap="wrap" gap={4}>
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                      Duration
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {Math.floor(selectedVideo.duration / 60)}h {Math.floor(selectedVideo.duration % 60)}m
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                      Upload Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {new Date(selectedVideo.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                      Subtitles
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      English, Spanish
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                      Resources
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      PDF, Code Samples
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Course Info */}
            <Paper elevation={0} sx={{ 
              padding: 3, 
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}>
              <Typography variant="h5" sx={{ 
                mb: 3,
                fontWeight: 700,
                letterSpacing: '-0.025em',
              }}>
                Course Overview
              </Typography>
              
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                <Box flex={1}>
                  <Typography variant="body1" paragraph sx={{ 
                    lineHeight: 1.7,
                    color: theme.palette.text.secondary,
                  }}>
                    Master modern React development with this comprehensive course designed for intermediate to advanced developers. 
                    You'll learn through hands-on projects, real-world examples, and professional coding patterns used by top tech companies.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    lineHeight: 1.7,
                    color: theme.palette.text.secondary,
                  }}>
                    The course covers everything from fundamental concepts to advanced techniques, with a special focus on performance optimization, 
                    state management, and testing strategies.
                  </Typography>
                </Box>
                
                <Box flex={1}>
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    fontWeight: 600,
                  }}>
                    Key Features
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
                    {[
                      "Interactive coding exercises", "Downloadable resources", 
                      "Certificate of completion", "Community support", 
                      "Q&A sessions", "Mobile-friendly"
                    ].map((item) => (
                      <Chip 
                        key={item} 
                        label={item} 
                        icon={<CheckCircle fontSize="small" />}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: theme.palette.grey[300],
                          color: theme.palette.text.primary,
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    fontWeight: 600,
                  }}>
                    What You'll Learn
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1.5}>
                    {[
                      "React Hooks", "Context API", "Performance Optimization",
                      "State Management", "Custom Hooks", "Testing", "SSR", "TypeScript",
                      "React 18 Features", "Component Patterns", "Authentication", "API Integration"
                    ].map((item) => (
                      <Chip 
                        key={item} 
                        label={item} 
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.grey[100],
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Container>
          
          {!isMobile && (
            <FloatingActionButton color="secondary" aria-label="help">
              <ClosedCaption />
            </FloatingActionButton>
          )}
        </Content>
      </Root>
    </ThemeProvider>
  );
}

export default Videos;