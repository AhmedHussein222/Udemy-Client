import { Box, Button, Link, Stack, Typography } from '@mui/material'
import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Slider from "react-slick";

function Welcomehome() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const settings = {
    dots: true,             
    infinite: true,         
    speed: 500,             
    slidesToShow: 1,       
    slidesToScroll: 1,      
    prevArrow: <div style={{ display: 'block', color: 'black', fontSize: '1rem' }}>‹</div>,
    nextArrow: <div style={{ display: 'block', color: 'black', fontSize: '1rem' }}>›</div>,
  };
  
  return (
    <Box>
       
 <Box
  sx={{
    position: 'relative',
    backgroundImage: 'url(https://s.udemycdn.com/teaching/billboard-desktop-2x-v4.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: { xs: '400px', sm: '450px', md: '500px' },
    display: 'flex',
    alignItems: 'center',
    px: { xs: 2, sm: 3, md: 4 },
    overflow: 'hidden',
  }}
>
  <Stack
    direction="column"
    sx={{
      zIndex: 2,
      textAlign: { xs: 'center', md: 'left' },
      ml: { xs: 0, md: 5 },
      width: '100%',
    }}
  >
    <Typography
      variant="h2"
      fontWeight="bold"
      gutterBottom
      sx={{
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
      }}
    >
      Come teach<br /> with us
    </Typography>
    <Typography
      variant="body1"
      gutterBottom
      sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
    >
      Become an instructor and change lives <br />— including your own
    </Typography>
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#8000ff",
        color: "#fff",
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "4px",
        py: 1,
        mt: 2,
        mb: 3,
        width: { xs: '100%', sm: 'fit-content' },
        mx: { xs: 'auto', md: 0 },
        "&:hover": { backgroundColor: "#6a1b9a" },
      }}
      onClick={()=>{}}
    >
      Get started
    </Button>
  </Stack>
</Box>
    
<Box>
  <Typography variant='h3' fontWeight={'bold'} textAlign={'center'} my={5}>So many reasons to start</Typography>
  <Stack direction={{ xs: 'column', md: 'row' }} gap={2} my={5} alignItems="center" justifyContent="center" flexWrap="wrap">
  <Box
    sx={{
      textAlign: 'center',
      maxWidth: 250,
      mx: 'auto',
    }}
  >
    <img
      src="https://s.udemycdn.com/teaching/value-prop-teach-v3.jpg"
      alt="Teach your way"
      style={{
        width: '50%',
        height: 'auto',
        marginBottom: 16,
      }}
    />
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Teach your way
    </Typography>
    <Typography variant="body2">
      Publish the course you want, in the way you want, and always have control of your own content.
    </Typography>
  </Box>

  <Box
    sx={{
      textAlign: 'center',
      maxWidth: 250,
      mx: 'auto',
    }}
  
  >
    <img
      src="https://s.udemycdn.com/teaching/value-prop-inspire-v3.jpg"
      alt="Inspire learners"
      style={{
        width: '50%',
        height: 'auto',
        marginBottom: 16,
      }}
    />
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Inspire learners
    </Typography>
    <Typography variant="body2">
      Teach what you love and help learners gain new skills, advance their careers, and explore new hobbies.
    </Typography>
  </Box>

  <Box
    sx={{
      textAlign: 'center',
      maxWidth: 250,
      mx: 'auto',
    }}
  >
    <img
      src="https://s.udemycdn.com/teaching/value-prop-get-rewarded-v3.jpg"
      alt="Get rewarded"
      style={{
        width: '50%',
        height: 'auto',
        marginBottom: 16,
      }}
    />
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Get rewarded
    </Typography>
    <Typography variant="body2">
      Expand your professional network, build your expertise, and earn money on each paid enrollment.
    </Typography>
  </Box>
  </Stack>


</Box>

<Stack
  direction={{ xs: 'column', sm: 'row' }}
  gap={4}
  sx={{
    color:"white",
    backgroundColor:' #5022c3',
    textAlign: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    py: 4,
  }}
>
  <Box>
    <Typography variant="h2" fontWeight="bold" color="white">73M</Typography>
    <Typography variant="h6" color="white">Students</Typography>
  </Box>

  <Box>
    <Typography variant="h2" fontWeight="bold" color="white">75+</Typography>
    <Typography variant="h6" color="white">Languages</Typography>
  </Box>

  <Box>
    <Typography variant="h2" fontWeight="bold" color="white">1B</Typography>
    <Typography variant="h6" color="white">Enrollments</Typography>
  </Box>

  <Box>
    <Typography variant="h2" fontWeight="bold" color="white">180+</Typography>
    <Typography variant="h6" color="white">Countries</Typography>
  </Box>

  <Box>
    <Typography variant="h2" fontWeight="bold" color="white">16,000+</Typography>
    <Typography variant="h6" color="white">Enterprise customers</Typography>
  </Box>
</Stack>

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  

  <Box>
    <Typography variant="h3" fontWeight="bold" textAlign={'center'} my={5}>How to begin</Typography>
  </Box>


  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            aria-label="tabs example"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' }, 
              '& .MuiTab-root': {
                color: 'black',
                fontWeight: 'bold',
                fontSize: { xs: 16, sm: 18 },
                minWidth: { xs: 'auto', sm: 120 },
                marginBottom: { xs: 1, sm: 0 },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'black',
                color:'black'
              }
            }}
          >
            <Tab label="Plan your curriculum" value="1" />
            <Tab label="Record your video" value="2" />
            <Tab label="Launch your course" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <Stack
            direction={{ xs: 'column', md: 'row' }} 
            alignItems="center"
            justifyContent="center"
            my={5}
            sx={{ px: { xs: 2, md: 5 }, gap: 3 }} 
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
              <Typography gutterBottom variant="body1">
                You start with your passion and knowledge.<br/> Then choose a promising topic with the help of our<br/> Marketplace Insights tool.
              </Typography>
              <Typography gutterBottom variant="body1">
                The way that you teach — what you bring to it<br/> — is up to you.
              </Typography>
              <Typography fontWeight="bold" gutterBottom variant="body1">
                How we help you
              </Typography>
              <Typography gutterBottom variant="body1">
                We offer plenty of resources on how <br/>to create your first course. And, our instructor<br/> dashboard and curriculum pages help keep you organized.
              </Typography>
            </Box>

            <Box
              component="img"
              src="https://s.udemycdn.com/teaching/plan-your-curriculum-v3.jpg"
              alt="Plan your curriculum"
              sx={{
                width: { xs: '100%', md: '500px' },
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </Stack>
        </TabPanel>

        <TabPanel value="2">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="center"
            my={5}
            sx={{ px: { xs: 2, md: 5 }, gap: 3 }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
              <Typography gutterBottom variant="body1">
                Gather your first ratings and reviews<br/> by promoting your course through social media and your <br/>professional networks.
              </Typography>
              <Typography gutterBottom variant="body1">
                Your course will be discoverable in our <br/>marketplace where you earn revenue from<br/> each paid enrollment.
              </Typography>
              <Typography fontWeight="bold" gutterBottom variant="h5">
                How we help you
              </Typography>
              <Typography gutterBottom variant="body1">
                Our custom coupon tool lets you offer enrollment<br/> incentives while our global promotions drive traffic <br/>to courses. There’s even more opportunity for courses <br/>chosen for Udemy Business.
              </Typography>
            </Box>

            <Box
              component="img"
              src="https://s.udemycdn.com/teaching/launch-your-course-v3.jpg"
              alt="Launch your course"
              sx={{
                width: { xs: '100%', md: '500px' },
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </Stack>
        </TabPanel>

        <TabPanel value="3">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="center"
            my={5}
            sx={{ px: { xs: 2, md: 5 }, gap: 3 }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
              <Typography gutterBottom variant="body1">
                Use basic tools like a smartphone or a DSLR<br/> camera. Add a good microphone and you’re ready <br/>to start.
              </Typography>
              <Typography gutterBottom variant="body1">
                If you don’t like being on camera,<br/> just capture your screen. Either way,<br/> we recommend two hours or more of video <br/>for a paid course.
              </Typography>
              <Typography fontWeight="bold" gutterBottom variant="h5">
                How we help you
              </Typography>
              <Typography gutterBottom variant="body1">
                Our support team is available to help you<br/> throughout the process and provide feedback<br/> on test videos.
              </Typography>
            </Box>

            <Box
              component="img"
              src="https://s.udemycdn.com/teaching/record-your-video-v3.jpg"
              alt="Record your video"
              sx={{
                width: { xs: '100%', md: '500px' },
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>


</Box>

<Slider
  {...settings}
  style={{ overflow: 'hidden' }}
  prevArrow={<div style={{ display: 'block', color: 'black', fontSize: '1rem' }}>‹</div>}
  nextArrow={<div style={{ display: 'block', color: 'black', fontSize: '1rem' }}>›</div>}
>
  <Box sx={{ backgroundColor: '#f5f5f5', my: 5, px: { xs: 2, sm: 5 } }}>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ maxWidth: '100%', overflow: 'hidden' }}
    >
      <Box
        component="img"
        src="https://s.udemycdn.com/teaching/instructors/en/frank-1x-v2.jpg"
        sx={{
          width: { xs: '80%', sm: '70%', md: 250 },
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'cover',
        }}
      />
      <Typography variant="body1" sx={{ textAlign: { xs: 'center', sm: 'left' }, maxWidth: '90%' }}>
        “I’m proud to wake up knowing my work is helping people<br /> around the world improve their careers and build great things.<br /> While being a full-time instructor is hard work,<br /> it lets you work when, where, and how you want.”<br />
        <strong>Frank Kane</strong>
      </Typography>
    </Stack>
  </Box>

  <Box sx={{ backgroundColor: '#f5f5f5', px: { xs: 2, sm: 5 } }}>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ maxWidth: '100%', overflow: 'hidden' }}
    >
      <Box
        component="img"
        src="https://s.udemycdn.com/teaching/instructors/en/paulo-1x.jpg"
        sx={{
          width: { xs: '80%', sm: '70%', md: 250 },
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'cover',
        }}
      />
      <Typography variant="body1" sx={{ textAlign: { xs: 'center', sm: 'left' }, maxWidth: '90%' }}>
        “Udemy has changed my life. It’s allowed me to follow<br /> my passion and become a teacher I love to see my students succeed<br /> and hear them say they’ve learned more, quicker,<br />from my courses than they did in college. It’s so humbling.”<br />
        <strong>Paulo Dichone</strong>
      </Typography>
    </Stack>
  </Box>

  <Box sx={{ backgroundColor: '#f5f5f5', px: { xs: 2, sm: 5 } }}>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ maxWidth: '100%', overflow: 'hidden' }}
    >
      <Box
        component="img"
        src="https://s.udemycdn.com/teaching/instructors/en/deborah-1x.jpg"
        sx={{
          width: { xs: '80%', sm: '70%', md: 250 },
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'cover',
        }}
      />
      <Typography variant="body1" sx={{ textAlign: { xs: 'center', sm: 'left' }, maxWidth: '90%' }}>
        “Teaching on Udemy has provided me with two important elements:<br /> the opportunity to reach more learners than I<br />ever would be able to on my own and a steady stream of extra income.”<br />
        <strong>Deborah Grayson Riege</strong>
      </Typography>
    </Stack>
  </Box>
</Slider>




    <Stack direction={{ xs: 'column', md: 'row' }}  my={5} justifyContent={'space-between'}>
      <Box
        component="img"
        src="https://s.udemycdn.com/teaching/support-1-v3.jpg"
        sx={{
          minWidth: 250,
          width: { xs: '80%', sm: 250 }, 
          objectFit: 'cover', 
          height: { xs: 'auto', sm: 250 },
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h3' fontWeight={'bold'}>
          You won’t have to do it alone
        </Typography>
        <Typography variant='body1'>
          Our <strong>Instructor Support Team</strong> is here to answer your questions and review your test video, while our <strong>Teaching Center</strong> gives you plenty of resources to help you through the process. Plus, get the support of experienced instructors in our <strong>online community</strong>.
        </Typography>
        <Typography variant='body1'>
          You won’t have to do it alone
        </Typography>
        <br />
        <Link color={'#af72fd'} fontWeight={'bold'}>
          Need more details before you start? Learn more.
        </Link>
      </Box>
      <Box
        component="img"
        src="https://s.udemycdn.com/teaching/support-2-v3.jpg"
        sx={{
          minWidth: 250,
          width: { xs: '80%', sm: 250 },
          objectFit: 'cover',
          height: { xs: 'auto', sm: 250 }, 
        }}
      />
    </Stack>

    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        my: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 5, 
      }}
    >

      <Typography
        variant="h3" 
        fontWeight="bold"
        sx={{ mb: 2 }} 
      >
        Become an instructor today
      </Typography>


      <Typography variant="h6" sx={{ mb: 3 }}>
        Join one of the world’s largest online learning <br/> marketplaces.
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#8000ff",
          color: "#fff",
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: "4px",
          py: 1,
          mt: 2,
          mb: 3,
          width: { xs: '100%', sm: 'fit-content' }, 
          mx: { xs: 'auto', sm: 0 },
          "&:hover": { backgroundColor: "#6a1b9a" },
        }}
        onClick={() => {}}
      >
        Get started
      </Button>
    </Box>


    </Box>
  )
}

export default Welcomehome
