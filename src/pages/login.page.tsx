import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Container,
  Typography,
  TextField,
  Box,
  Stack,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useLoginUserMutation } from "../redux/api/authApi";

const loginUserSchema = object({
  email: string().min(1, "Email is requied.").email("Invalid email format."),
  password: string()
    .min(1, "Password is required.")
    .min(8, "Password must be longer than 8 characters."),
});

export type LoginUserSchema = TypeOf<typeof loginUserSchema>;

const SigninPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginUser, loginState] = useLoginUserMutation();

  useEffect(() => {
    if (loginState.isSuccess) {
      toast.success(loginState.data.message);
      navigate("/");
    }
    if (loginState.isError) {
      if (Array.isArray((loginState.error as any).data.error))
        (loginState.error as any).detail.forEach((el: any) =>
          toast.error(el.message)
        );
      else toast.error((loginState.error as any).data.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  const methods = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserSchema> = (
    values: LoginUserSchema
  ) => {
    loginUser(values);
  };

  return (
    <>
      <Container>
        <Typography variant="h5" textAlign="center" mt={6}>
          {t("login.title")}
        </Typography>
        <Typography color="primary.main" variant="h4" textAlign="center" my={6}>
          {t("login.log_in")}
        </Typography>
        <Box
          component="form"
          noValidate
          display="flex"
          justifyContent="center"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormProvider {...methods}>
            <Stack width={300} gap={3}>
              <TextField
                {...register("email")}
                label={t("home.common.email")}
                placeholder={t("login.email_placeholder") as string}
                size="small"
                error={!!errors["email"]}
                helperText={
                  errors["email"]?.message
                    ? t("home.common.email_required")
                    : null
                }
              />
              <TextField
                {...register("password")}
                label={t("login.password")}
                type="password"
                placeholder={t("login.password_placeholder") as string}
                size="small"
                error={!!errors["password"]}
                helperText={
                  !errors["password"]?.message
                    ? null
                    : errors["password"].message.includes("required")
                    ? t("login.password_required")
                    : t("login.password_longer")
                }
              />
              <LoadingButton variant="contained" type="submit">
                {t("login.confirm")}
              </LoadingButton>
              <Link
                textAlign="center"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                {t("login.forgot_password")}
              </Link>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
};

export default SigninPage;
