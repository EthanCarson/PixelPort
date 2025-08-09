import { createResource, For } from "solid-js";
import sanityClient from "./sanityClient";

// Define the type for our project data based on your schema
interface Project {
  _id: string;
  name?: string;
  // Add other project fields here as needed
}

// This function fetches the data from Sanity
const fetchProjects = async (): Promise<Project[]> => {
  const query = '*[_type == "project"]'; // GROQ query to fetch all projects
  const projects = await sanityClient.fetch<Project[]>(query);
  return projects;
};

function App() {
  // createResource handles the async loading for us
  const [projects] = createResource<Project[]>(fetchProjects);

  return (
    <div>
      <h1>Projects from Sanity</h1>
      {projects.loading && <p>Loading projects...</p>}
      {projects.error && <p>Error fetching projects: {projects.error.message}</p>}
      
      <ul>
        <For each={projects()} fallback={<li>No projects found.</li>}>
          {(project) => (
            <li data-id={project._id}>
              {project.name || 'Unnamed Project'}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export default App;