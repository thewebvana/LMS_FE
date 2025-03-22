import { TenStackTable } from "@/components/shadcn/tenstacktable";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";

export default function Users() {
	return (
		<>
			<div className="mt-2">
				<div className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								<UserRoundPlus /> Add
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>
								Admin
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								Teacher
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>
								Student
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="mt-5">

						<TenStackTable />
		
				</div>
			</div>
			{/* <Tabs defaultValue="admins">
				<TabsList>
					<TabsTrigger value="admins">Admins</TabsTrigger>
					<TabsTrigger value="teachers">Teachers</TabsTrigger>
					<TabsTrigger value="students">Students</TabsTrigger>
					<TabsTrigger value="parents">Parents</TabsTrigger>
				</TabsList>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>
							<UserRoundPlus /> Add
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setTheme("light")}>
							Light
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("dark")}>
							Dark
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("system")}>
							System
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
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
			</Tabs> */}
		</>
	);
}
