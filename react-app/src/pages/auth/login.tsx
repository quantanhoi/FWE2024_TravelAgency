import { BaseLayout } from "../../layout/BaseLayout";
import { AuthCard } from "./components/authCard";
import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import { object, string } from "yup";
import { LoginUserData, useAuth } from "../../providers/authProvider";

export const LoginUserSchema = object({
    email: string().required(),
    password: string().required(),
});

const initialFormValues: LoginUserData = {
    email: "",
    password: "",
};

export const LoginPage = () => {
    const { onLogin } = useAuth();
    return (
        <BaseLayout>
            <AuthCard>
                <Heading>Login</Heading>

                <Formik<LoginUserData>
                    initialValues={initialFormValues}
                    onSubmit={onLogin}
                    validationSchema={LoginUserSchema}
                >
                    {(formik) => (
                        <Form onSubmit={formik.handleSubmit}>
                            <VStack alignItems={"flex-start"}>
                                <InputControl
                                    label="E-mail"
                                    inputProps={{ placeholder: "Email" }}
                                    name="email"
                                />
                                <InputControl
                                    label="Password"
                                    inputProps={{ type: "password", placeholder: "Password" }}
                                    name="password"
                                />
                                <Button type="submit">Login</Button>
                                <Box>
                                    Keinen Account?{" "}
                                    <Link as={RouterLink} to="/auth/register">
                                        Register
                                    </Link>
                                </Box>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </AuthCard>
        </BaseLayout>
    );
};
