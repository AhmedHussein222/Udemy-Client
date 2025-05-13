import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, CardActionArea, CardContent, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import DescriptionIcon from '@mui/icons-material/Description';

const steps = ['Step1', 'Step2', 'Step3', 'Step4'];

export default function CreateCourse() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const stepContent = [
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h5' fontWeight={'bold'} my={5} textAlign={'center'}>
        First, let's find out what type of course you're making.
      </Typography>
      <Stack direction={'row'} justifyContent={'center'} gap={3}>
        <Card
          sx={{
            maxWidth: 345,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#d8e0fb',
              border: '2px solid black',
            },
          }}
        >
          <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <OndemandVideoIcon sx={{ fontSize: 40, marginBottom: 2, mt: 5 }} />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="body1" component="div" fontWeight={'bold'}>
                Course
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Create rich learning experiences with the help of video lectures, quizzes, coding exercises, etc.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          sx={{
            maxWidth: 345,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#d8e0fb',
              border: '2px solid black',
            },
          }}
        >
          <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 40, marginBottom: 2, mt: 5 }} />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="body1" component="div" fontWeight={'bold'}>
                Practice Test
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Help students prepare for certification exams by providing practice questions.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>,

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h5' fontWeight={"bold"} textAlign={'center'} my={2}>
        How about a working title?
      </Typography>
      <Typography variant='body1' textAlign={'center'} my={1}>
        It's ok if you can't think of a good title now. You can change it later.
      </Typography>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        sx={{
          maxWidth: 500,
          borderRadius: '8px',
          padding: '10px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
          '& .MuiInputLabel-root': {
            color: '#1976d2',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1565c0',
          },
          '& .MuiInputBase-root': {
            fontSize: '1rem',
          },
          my: 5,
        }}
      />
    </Box>,

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h5' fontWeight={"bold"} textAlign={'center'} my={3}>
        What category best fits the knowledge you'll share?
      </Typography>
      <Typography variant='body1' textAlign={'center'} my={3}>
        Choose the category that best fits the knowledge you'll share.
      </Typography>

      <FormControl sx={{ width: '100%', maxWidth: 400 }}>
        <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Select Category"
          sx={{
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            '& .MuiSelect-icon': {
              color: '#1976d2',
            },
          }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>,

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h5' fontWeight={"bold"} textAlign={'center'} my={4}>
        How much time can you spend creating your course per week?
      </Typography>
      <Typography variant='body1' textAlign={'center'} my={3}>
        There's no wrong answer. We can help you achieve your goals even if you don't have much time.
      </Typography>

      <FormControl>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="1" name="radio-buttons-group">
          <FormControlLabel
            value="1"
            control={<Radio />}
            label="I’m very busy right now (0-2 hours)"
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              '&.Mui-selected': {
                backgroundColor: '#e0f7fa',
              },
            }}
          />
          <FormControlLabel
            value="2"
            control={<Radio />}
            label="I’ll work on this on the side (2-4 hours)"
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              '&.Mui-selected': {
                backgroundColor: '#e0f7fa',
              },
            }}
          />
          <FormControlLabel
            value="3"
            control={<Radio />}
            label="I have lots of flexibility (5+ hours)"
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              '&.Mui-selected': {
                backgroundColor: '#e0f7fa',
              },
            }}
          />
          <FormControlLabel
            value="4"
            control={<Radio />}
            label="I haven’t yet decided if I have time"
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              '&.Mui-selected': {
                backgroundColor: '#e0f7fa',
              },
            }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}></Typography>
            {stepContent[activeStep]}

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
