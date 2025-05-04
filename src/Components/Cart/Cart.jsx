
import { Style } from '@mui/icons-material'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, Stack, TextField, Typography } from '@mui/material'
import { grey, purple, yellow } from '@mui/material/colors'
import React from 'react'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

function Cart() {



  return (
    <Box>
 //#region If card is empty
        <Box  sx={{ px: 3}}>
    <Typography variant="h4" sx={{ textAlign: "start", marginTop: "20px", fontWeight: "bold" }}>
      Shopping Cart
    </Typography>
    <Typography variant="h6" sx={{ textAlign: "start", marginTop: "20px", fontWeight: "bold" }}>
      0 courses in cart
    </Typography>
        </Box>

  <Stack direction="column" alignItems="center" sx={{ px: 2, width: '100%' ,pb:3}}>
  <Card
    sx={{
      width: "100%",  
      marginTop: "20px",
      borderRadius: "10px",
      px: 2,
      '@media (max-width: 600px)': {
        width: "100%",  
      },
    }}
  >
    <CardActionArea>
      <CardMedia
        component="img"
        height="140"
        image="/src/assets/empty-shopping-cart-v2-2x.webp"
        alt="Cart empty"
        sx={{
          marginTop: 5,
          marginBottom: 3,
          width: "100%", 
          objectFit: "contain",
          mx: "auto",
       
        }}
      />
      <CardContent>
        <Typography
          marginBottom={3}
          variant="subtitle2"
          component="div"
          textAlign="center"
        >
          Your cart is empty. Keep shopping to find a course!
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
            mb:3,
            display: "block",
            mx: "auto", 
            "&:hover": { backgroundColor: "#6a1b9a" },
          }}
          size='large'
        >
          Keep shopping
        </Button>
      </CardContent>
    </CardActionArea>
  </Card>
</Stack>

//#endregion

//#region  card is not empty

<Box  sx={{ px: 3}}>
    <Typography variant="h4" sx={{ textAlign: "start", marginTop: "20px", fontWeight: "bold" }}>
      Shopping Cart
    </Typography>
    <Typography variant="h6" sx={{ textAlign: "start", marginTop: "20px", fontWeight: "bold" }}>
      0 courses in cart
    </Typography>
        </Box>

 <Stack   direction={{ xs: "column", md: "row" }}
  justifyContent="space-around"
  alignItems="flex-start"
  spacing={3}
  sx={{ px: 2, width: "100%", pb: 3 }}>
   <Card  sx={{ width: { xs: "100%", md: "70%" ,paddingTop:4 } }}>
    <Grid container spacing={2}>
  <Grid size={3}>
  <CardMedia
        component="img"
        height="140"
        image="https://img-c.udemycdn.com/course/240x135/2196488_8fc7_10.jpg"
        alt="Cart empty"
        sx={{
          marginTop: 5,
          marginBottom: 3,
          width: "100%", 
          objectFit: "contain",
          mx: "auto",
       
        }}
      />
  </Grid>
  <Grid size={5}>
<Typography variant='subtitle1' sx={{fontWeight:'bold'}}>Ultimate AWS Certified Solutions Architect Associate 2025</Typography>
<Typography variant='subtitle2' sx={{color:grey}}>Stephane Maarek | AWS Certified Cloud Practitioner,Solutions Architect,Developer</Typography>
 <Stack direction={'row'} gap={2}>
    <Button variant="text" size='small' sx={{background:purple[100]}}>Best seller</Button>
    <Grid size={4}>
        <Stack direction={'row'}><StarBorderIcon  sx={{color:yellow[700]}}/><StarBorderIcon sx={{color:yellow[700]}} /> <StarBorderIcon  sx={{color:yellow[700]}}/><StarBorderIcon sx={{color:yellow[700]}} /> <StarBorderIcon  sx={{color:yellow[700]}}/>
      </Stack>

    </Grid>
    <Grid size={4}></Grid>
 </Stack>
 


        <Stack direction={'row'} gap={2}>  <Typography variant='subtitle2' color='grey'>22 total hours</Typography>
         <Typography variant='subtitle2' color='grey'>35 lecture</Typography>
         <Typography variant='subtitle2' color='grey'> All levels</Typography >
        </Stack>



  </Grid>

  <Grid size={2}>
    <Stack direction={'column'} gap={2} >
<Button variant="text" size='small' sx={{color:'#8000ff'}}>Remove</Button>
<Button variant="text" size='small' sx={{color:'#8000ff'}}>Save for later</Button>
<Button variant="text" size='small' sx={{color:'#8000ff'}}>Move to wishlist</Button>
</Stack>
  </Grid>
  <Grid size={2}>
    <Stack direction={'column'} gap={2} >
        <Typography variant='subtitle1' sx={{fontWeight:'bold' ,color:'#8000ff'}}>Price</Typography>
        <Typography variant='subtitle1' sx={{color:grey[500],textDecoration:'line-through'}}>Discount</Typography>
        </Stack>

  </Grid>
</Grid>

</Card> 

<Card
sx={{ width: { xs: "100%", md: "27%" } }}
>
  <CardContent>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
      Total
    </Typography>

    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      $199
    </Typography>

    <Typography
      variant="subtitle1"
      sx={{ color: grey[500], textDecoration: "line-through" }}
    >
      $249
    </Typography>

    <Typography variant="subtitle1">20% off</Typography>

    <Button
      variant="contained"
      sx={{
        background: "#8000ff",
        color: "white",
        fontWeight: "bold",
        borderRadius: "4px",
        fontSize: 12,
        mt: 2,
        px: 3,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        "&:hover": {
          backgroundColor: "#6a1b9a",
        },
      }}
    >
      Proceed to Checkout <ArrowForwardIcon fontSize="small" />
    </Button>

    <Typography variant="subtitle2" sx={{ color: grey[500], mt: 1 ,borderBottom:'1px solid lightgray',paddingBottom:2}}>
      You won't be charged yet
    </Typography>

    <Box   sx={{border:'1px dashed gray',borderRadius:'5px',padding:2,marginTop:2}}>
        <Stack direction={'row'} gap={5} >
            <Box>
            <Typography variant='subtitle2' sx={{color:'gray',fontSize:14}}>ST8MT220425G3  is applied</Typography>
            <Typography variant='subtitle2' sx={{color:'gray',fontSize:14}}>Udemy coupon</Typography>
            </Box>
            <Box>
                 <CloseIcon sx={{alignSelf:'center'}}/>
            </Box>




        </Stack>

    </Box>

    <Stack direction={'row'} gap={1} sx={{marginTop:2}}>
    <TextField  label="Inter coupon" variant="outlined"  size='small'/>
    <Button variant="contained" size='small' sx={{backgroundColor:'#8000ff',fontSize:10,fontWeight:'bold'}}>Apply</Button>

    </Stack>
  </CardContent>
</Card>


        </Stack>



//#endregion



  </Box>
  
  )
}



export default Cart
