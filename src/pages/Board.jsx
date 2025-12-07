import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import tecboardLogo from "../assets/tecboard.svg";
import bannerImage from "../assets/banner.png";
import { eventSchema } from "../schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Chip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  backgroundColor: theme.palette.textSecondary,
  padding: "8px",
  borderRadius: "4px",
  mb: 1,
}));

export function Board() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  async function getEvents(page = 1) {
    const response = await fetch(
      `http://localhost:3000/events?_page=${page}&_per_page=4&_sort=-id&_order=desc`
    );
    return response.json();
  }

  const {
    data: eventsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getEvents", page],
    queryFn: () => getEvents(page),
    placeholderData: (previousData) => previousData, 
  });

  async function postEvents(event) {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  const postEventMutation = useMutation({
    mutationKey: ["postEvents"],
    mutationFn: postEvents,
    onSuccess: async () => {
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ["getEvents"] });
    },
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(eventSchema),
  });

  function handleOnSubmit(data) {
    const dadosComImagem = {
      ...data,
      image: "https://placehold.co/236x282",
    };
    postEventMutation.mutate(dadosComImagem);
    reset(); 
  }

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#06151A" }}>
      {/* Header */}
      <AppBar position="static" sx={{ py: 2, backgroundColor: "#06151A" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <img src={tecboardLogo} alt="Logo" style={{ height: "28px" }} />
        </Toolbar>
      </AppBar>

      {/* Seção de Banner */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          height: "600px",
          background: "linear-gradient(180deg, #17D9B1 0%, #06151A 100%)",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <img src={bannerImage} alt="Banner" />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              position: "absolute",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "652px",
              textAlign: "center",
            }}
          >
            Seu hub de eventos de tecnologia
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#06151A",
          py: 8,
        }}
      >
        {/* Formulário */}
        <Box
          component="form"
          onSubmit={handleSubmit(handleOnSubmit)}
          sx={{
            backgroundColor: "#212121",
            width: "100%",
            maxWidth: "384px",
            py: "32px",
            px: "28px",
            borderRadius: 2,
          }}
        >
          <Typography>Preencha para criar um evento:</Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel
                shrink
                htmlFor="name"
                sx={{ position: "static", transform: "none", mb: 1 }}
              >
                Qual o nome do evento?
              </InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    id="name"
                    placeholder="Summer dev hits"
                    fullWidth
                    sx={{ height: "36px" }}
                    {...field}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel
                shrink
                htmlFor="date"
                sx={{ position: "static", transform: "none", mb: 1 }}
              >
                Data do evento
              </InputLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    id="date"
                    placeholder="XX/XX/XXXX"
                    fullWidth
                    sx={{ height: "36px" }}
                    {...field}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel
                shrink
                htmlFor="theme"
                sx={{ position: "static", transform: "none", mb: 1 }}
              >
                Tema do evento
              </InputLabel>
              <Controller
                name="theme"
                control={control}
                render={({ field }) => (
                  <Select
                    id="theme"
                    displayEmpty
                    fullWidth
                    sx={{ height: "36px" }}
                    {...field}
                    value={field.value || ""}
                  >
                    <MenuItem value="" disabled>
                      Selecione uma opção
                    </MenuItem>
                    <MenuItem value="Front-end">Front-end</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <Button type="submit" sx={{ alignSelf: "center" }}>
              Criar evento
            </Button>
          </Stack>
        </Box>

        {isError && <Typography sx={{ mt: 2, color: 'red' }}>Erro ao carregar eventos.</Typography>}
        {isLoading && <Typography sx={{ mt: 2, color: 'white' }}>Carregando...</Typography>}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "1200px",
            mt: "60px",
            gap: "64px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              Página anterior
            </Button>
            <Button
              onClick={() => setPage((old) => old + 1)}
              disabled={!eventsData || eventsData.length < 4}
            >
              Próxima página
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto" }}>
            {!isError &&
              !isLoading &&
              eventsData?.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card sx={{ width: "282px", height: "100%" }}>
                    <CardMedia
                      component="img"
                      height="236px"
                      image={event.image}
                      alt={event.name}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        py: 3,
                        px: 2,
                        backgroundColor: "#212121",
                      }}
                    >
                      <Chip>
                        <Typography variant="caption">{event.theme}</Typography>
                      </Chip>
                      <Typography sx={{ mt: 1 }}>{event.date}</Typography>
                      <Typography variant="h6">{event.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}