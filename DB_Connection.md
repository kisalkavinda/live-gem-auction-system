## How Developers Should Configure Their Credentials

Each developer can now configure their local database using one of two approaches:

Approach A: Using Environment Variables in IDE (Recommended)
Developers can set the environment variables directly in their IDE (like IntelliJ IDEA or Eclipse).

Go to Run/Debug Configurations.
Find the Spring Boot configuration for GemhavenBackendApplication.
In the Environment variables field, add the required properties:
text
DB_URL=jdbc:postgresql://localhost:5432/gemhaven_db;DB_USERNAME=postgres;DB_PASSWORD=your_local_password
Approach B: Using a Local Properties Profile
If a developer prefers a file-based configuration:

Create a file named application-local.properties inside src/main/resources/. (This file is ignored by Git).
Add the actual credentials into this file:
properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gemhaven_db
spring.datasource.username=postgres
spring.datasource.password=your_local_password
To use this file, run the application with the local profile enabled.
3. How to Run the Application Locally
Using Maven (Terminal): If a developer sets their environment variables in the terminal, they can run the application normally:

bash
# Set environment variables (Windows PowerShell)
$env:DB_URL="jdbc:postgresql://localhost:5432/gemhaven_db"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_local_password"
# Start the application
./mvnw spring-boot:run
Using the Local Profile with Maven: If they chose Approach B (created application-local.properties), they can run it like this:

bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local