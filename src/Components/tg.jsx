import { Button, Card, CardContent, Typography } from "@mui/material";

export function TelegramLikeUI() {
  return (
    <Card sx={{ maxWidth: 345, background: "#18222d", color: "white" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Telegram-like Card
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Это карточка в стиле Telegram, сделанная на MUI.
        </Typography>
        <Button variant="contained" color="primary">
          Кнопка в стиле TG
        </Button>
      </CardContent>
    </Card>
  );
}