import { TenStackTable } from "@/components/tenstacktable/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



export default function Page() {

    return (
        <>
            <Tabs defaultValue="admins">
                <TabsList>
                    <TabsTrigger value="admins">Admins</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="parents">Parents</TabsTrigger>
                </TabsList>
                <div className="mb-6"></div>
                <TabsContent value="admins">
                    <TenStackTable />
                </TabsContent>
                <TabsContent value="teachers">
                    <TenStackTable />
                </TabsContent>
                <TabsContent value="students">
                    <TenStackTable />
                </TabsContent>
                <TabsContent value="parents">
                    <TenStackTable />
                </TabsContent>
            </Tabs>


        </>
    )
}