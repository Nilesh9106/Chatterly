import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Form, useNavigation } from "react-router-dom"

export default function Auth() {
    const navigation = useNavigation();
    return (
        <>
            <div className="w-full h-screen flex justify-center  my-36">
                <Tabs defaultValue="login" className="w-[500px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Form method="post" action="/login">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>
                                        Login to your CipherChat account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="email">email</Label>
                                        <Input id="email" type="email" name="email" placeholder="Email" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" name="password" placeholder="Password" required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button disabled={!(navigation.state == "idle")} type="submit" className="w-full">{navigation.state == "submitting" ? "Submitting" : (navigation.state == "loading" ? "Done" : "Login")}</Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Form method="post" action="/signup">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sign up</CardTitle>
                                    <CardDescription>
                                        Create a new CipherChat account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">

                                    <div className="space-y-1">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" type="text" name="name" placeholder="Name" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" name="email" placeholder="Email" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" placeholder="Password" name="password" type="password" required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button disabled={!(navigation.state == "idle")} type="submit" className="w-full">{navigation.state == "submitting" ? "Submitting" : (navigation.state == "loading" ? "Done" : "Sign up")}</Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

