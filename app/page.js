"use client";
import {
  Container,
  Box,
  Typography,
  Link,
  Button,
  Drawer,
  IconButton,
  GlobalStyles,
  Paper,
  Grid,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Istok_Web, Galada } from "next/font/google";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel";
const istok_web = Istok_Web({ weight: ["400", "700"], subsets: ["latin"] });
const galada = Galada({ weight: "400", subsets: ["latin"] });

const items = [
  {
    name: "User-Friendly Interface",
    description:
      "Enjoy a clean and intuitive UI that makes managing your pantry a breeze. The design is straightforward, ensuring that even beginners can navigate effortlessly.",
  },
  {
    name: "Comprehensive Pantry Management",
    description:
      "Easily add, delete, and remove items from your pantry. Keep track of your inventory with just a few clicks, making it simple to stay organized and avoid running out of essentials.",
  },
  {
    name: "Efficient Search Functionality",
    description:
      "Quickly find any item in your pantry with our powerful search feature. No more scrolling through long lists—just type in what you're looking for, and find it instantly.",
  },
  {
    name: "Responsive Design",
    description:
      "Access your pantry tracker on any device, whether it's a desktop, tablet, or smartphone. The responsive layout ensures a seamless experience, adapting perfectly to any screen size.",
  },
];

const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          p: 50,
          m: 0,
          fontWeight: "bold",
          width: "100vw",
        },
      },
    },
    MuiTypography: {
      fontFamily: `${istok_web.style.fontFamily}, sans-serif`,
      lineHeight: "2em",
      fontSize: "20px",
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#000",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          fontFamily: `${istok_web.style.fontFamily}, sans-serif`,
          borderRadius: "15px",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "#fff",
            boxShadow: "none",
          },
        },
      },
    },
  },
});
export default function Home() {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const groupedItems = isMobile
    ? items.map((item) => [item])
    : [
        [items[0], items[1]],
        [items[1], items[2]],
        [items[2], items[3]],
      ];

  function Item(props) {
    return (
      <Paper
        sx={{
          backgroundColor: "#F1F8E8",
          borderRadius: "15px",
        }}
      >
        <Box
          width={"90%"}
          margin={"auto"}
          minHeight="fit-content"
          sx={{ display: "flex", flexDirection: "column", py: "40px" }}
        >
          <Typography
            color="#5E990E"
            sx={{ fontSize: "30px", fontWeight: "700" }}
          >
            {props.item.name}
          </Typography>
          <Typography
            sx={{
              lineHeight: "2em",
              color: "#676767",
              fontSize: "20px",
            }}
          >
            {props.item.description}
          </Typography>
        </Box>
      </Paper>
    );
  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSignUp = () => {
    router.push("./signup");
  };

  const handleLogin = () => {
    router.push("./login");
  };
  return (
    <ThemeProvider theme={theme}>
      <>
        <link rel="icon" href="logo.svg" />
        <GlobalStyles styles={{ html: { scrollBehavior: "smooth" } }} />
      </>
      <Container disableGutters maxWidth={"false"}>
        <Box
          width={"90%"}
          margin={"auto"}
          backgroundColor="#fff"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "20px",
          }}
        >
          <Box flex="1" sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component={"img"}
              sx={{
                width: "65px",
                height: "60px",
              }}
              src="logo.svg"
            />
            <Typography
              sx={{
                fontFamily: `${galada.style.fontFamily}`,
                fontSize: "45px",
                pl: "15px",
              }}
            >
              PanMan
            </Typography>
          </Box>
          <Box
            flex="1"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Link href="./">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                Home
              </Typography>
            </Link>
            <Link href="#about">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                About
              </Typography>
            </Link>
            <Link href="#contacts">
              <Typography
                fontSize="25px"
                color="#676767"
                sx={{ ":hover": { color: "#1c1b1d" } }}
              >
                Contacts
              </Typography>
            </Link>
          </Box>
          <Box
            flex="1"
            gap={3}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Button
              variant="contained"
              sx={{
                border: "2px solid #73B915",
                color: "#1c1b1d",
                backgroundColor: "#fff",
                fontWeight: "700",
                ":hover": {
                  backgroundColor: "#fbfcfa",
                },
                fontSize: "25px",
              }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              sx={{
                border: "none",
                backgroundColor: "#73B915",
                color: "#fff",
                fontWeight: "700",
                ":hover": {
                  backgroundColor: "#5b940f",
                },
                fontSize: "25px",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ fontSize: "50px" }} />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              paddingLeft="30px"
              paddingTop="30px"
            >
              <Link href="./">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  Home
                </Typography>
              </Link>
              <Link href="#about">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  About
                </Typography>
              </Link>
              <Link href="#contacts">
                <Typography
                  fontSize="25px"
                  color="#676767"
                  sx={{ ":hover": { color: "#1c1b1d" }, padding: "10px" }}
                >
                  Contacts
                </Typography>
              </Link>
              <Button
                variant="contained"
                sx={{
                  border: "2px solid #73B915",
                  color: "#1c1b1d",
                  backgroundColor: "#fff",
                  fontWeight: "700",
                  ":hover": {
                    backgroundColor: "#fbfcfa",
                  },
                  fontSize: "25px",
                  marginTop: "10px",
                  width: { xs: "200px" },
                }}
                onClick={handleSignUp}
              >
                Sign up
              </Button>
              <Button
                variant="contained"
                sx={{
                  border: "none",
                  backgroundColor: "#73B915",
                  color: "#fff",
                  fontWeight: "700",
                  ":hover": {
                    backgroundColor: "#5b940f",
                  },
                  fontSize: "25px",
                  marginTop: "15px",
                  width: { xs: "200px" },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Box>
          </Drawer>
        </Box>

        <Box
          id="home"
          width={"90%"}
          margin={"auto"}
          backgroundColor="#fff"
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: { md: "start", xs: "center" },
            alignItems: "center",
            mt: { md: "60px", xs: "20px" },
            pb: "50px",
          }}
        >
          <Box sx={{ flex: { md: "2", xs: "1" } }}>
            <Typography
              sx={{
                fontFamily: `${galada.style.fontFamily}`,
                fontSize: { md: "50px", xs: "40px" },
              }}
            >
              Welcome to PanMan
            </Typography>
            <Typography
              sx={{
                lineHeight: "2em",
                color: "#676767",
                mb: "20px",
                fontSize: "20px",
                pr: { md: "10%", xs: "0" },
              }}
            >
              With PanMan, you can effortlessly keep track of your pantry items
              and enjoy a seamless experience that helps you stay organized and
              reduce food waste. Whether you’re a busy professional, a home
              cook, or someone who loves to experiment in the kitchen, PanMan is
              here to support your culinary adventures.{" "}
            </Typography>
            <Button
              variant="contained"
              sx={{
                border: "none",
                backgroundColor: "#73B915",
                color: "#fff",
                fontWeight: "700",
                ":hover": {
                  backgroundColor: "#5b940f",
                },
                px: { md: "20px", xs: "0" },
                fontSize: "25px",
                width: { md: "fit-content", xs: "100%" },
                mb: { xs: "40px" },
              }}
              href="#about"
            >
              Learn More
            </Button>
          </Box>
          <Box flex="1">
            <Box
              component={"img"}
              src="pantry.jpg"
              minwidth="90%"
              sx={{
                padding: "10px",
                border: "2px dashed #000",
                borderRadius: "50%",

                width: { md: "500px", xs: "300px" },
                height: { md: "500px", xs: "300px" },
              }}
            />
          </Box>
        </Box>

        <Box id="about" backgroundColor="#F2F8F6" py={"50px"}>
          <Box width={"90%"} margin={"auto"} height="fit-content">
            <Typography
              sx={{ fontSize: "35px", textAlign: "center", fontWeight: "bold" }}
            >
              About
            </Typography>
            <Typography
              sx={{
                lineHeight: "2em",
                color: "#676767",
                fontSize: "20px",
                pb: "30px",
              }}
            >
              Our pantry tracker app is designed to make managing your pantry
              simple and efficient. Here are some of the key features:
            </Typography>
            <Carousel
              animation="slide"
              autoPlay={false}
              indicators={true}
              navButtonsAlwaysVisible={true}
              cycleNavigation={true}
              interval={4000} // Duration between automatic transitions (in ms)
              timeout={5000}
              navButtonsProps={{
                style: {
                  backgroundColor: "#676767",
                  borderRadius: "15px",
                },
              }}
              indicatorIconButtonProps={{
                style: {
                  padding: "10px", // Adjust the padding
                  color: "rgba(0, 0, 0, 0.4)", // Color of inactive indicators
                  marginTop: { lg: "80px", sm: "200px", xs: "10px" },
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: "#73B915",
                },
              }}
            >
              {groupedItems.map((group, i) => (
                <Grid container spacing={4} key={i}>
                  {group.map((item, j) => (
                    <Grid item md={12} lg={6} key={j}>
                      <Item item={item} minHeight="300px" maxHeight={"500px"} />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Carousel>
          </Box>
        </Box>

        <Box
          id="contacts"
          width={"90%"}
          margin={"auto"}
          backgroundColor="#fff"
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: { md: "start", xs: "center" },
            alignItems: { md: "start", xs: "start" },
            mt: "50px",
            my: { md: "80px", xs: "50px" },
            overflow: "hidden",
          }}
        >
          <Box flex="1">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component={"img"}
                sx={{
                  width: "65px",
                  height: "60px",
                }}
                src="logo.svg"
              />
              <Typography
                sx={{
                  fontFamily: `${galada.style.fontFamily}`,
                  fontSize: "45px",
                  pl: "15px",
                }}
              >
                PanMan
              </Typography>
            </Box>
            <Box>
              <Typography color="#676767">Organize, Optimize, Cook.</Typography>
              <Typography color="#676767">©️ 2024 PanMan.</Typography>
              <Typography color="#676767">
                Designed and developed by{" "}
                <Link href="https://github.com/ganbnuray" color="#1976D2">
                  Nuray Ganbarova ❤️
                </Link>
              </Typography>
            </Box>
          </Box>
          <Box flex="1" sx={{ alignself: { xs: "start" } }}>
            <Box>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                Contacts
              </Typography>
              <Typography color="#676767">ganbnuray@gmail.com</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
