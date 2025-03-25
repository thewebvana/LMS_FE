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
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "@/components/utils/services/config";
import { MoreHorizontal } from "lucide-react";
import useModalStore from "@/store/useModalStore";
import EditUser from "./edit";

export default function Users() {
	const { openModal } = useModalStore();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["getAllUsers"],
		queryFn: getAllUsers,
	});

	const hideColumns = ["user_id"];

	const customColumns = [
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() =>
									openModal({
										Component: EditUser, // Pass the component
										props:  row.original ,
										title: "Edit User",
										description: "Fill out the form to edit user account.",
									})
								}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(row.getValue("invoice"))
								}
							>
								Delete
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>View details</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];


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
					<TenStackTable
						data={data?.data}
						isLoading={isLoading}
						hideColumns={hideColumns}
						columnsTypes={data?.columnsTypes}
						customColumns={customColumns}
						isError={isError}
					/>
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
