import useAxios from "@/axios/interceptors";
import { useEffect } from "react";

export default function Dashboard() {
	const [Axios] = useAxios();


	useEffect(() => {
		// async function fetchData() {
		// 	try {
		// 		let response = await Axios.get("/test", {
		// 			params: {
		// 				p1: "xyz",
		// 			},
		// 		});
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// }
		// fetchData();
	}, []);


	useEffect(() => {
		async function fetchData() {

      let payload = {
        data: "xya", 
        test: "djjf"
      }

			try {
				let response = await Axios.get("/v1/users", payload);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);


	return (
		<div>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div>
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
		</div>
	);
}
