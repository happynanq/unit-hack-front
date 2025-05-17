import { Box, Container, AppBar, Toolbar, Typography, Menu } from "@mui/material";
import {AppMenu} from "./AppMenu"
export function Layout() {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
      
      }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ladder Enjoyers</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{
        flex: 1,  // Это заставляет контейнер занимать всё свободное пространство
        py: 4,
        display: 'flex',
        flexDirection: 'column'
       }}>
        <main><AppMenu/></main>
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'grey.100' }}>
        <Container maxWidth="md">
          <Typography>LADDER ENJOYERS 2025</Typography>
        </Container>
      </Box>
    </Box>
  );
}