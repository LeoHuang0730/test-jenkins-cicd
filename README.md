"# test-jenkins-cicd" trying to update 1
Jenkins + GCP VM + GitHub

1. GCP VM
	-> Login to GCP account

		-> Create VM
			-> Machine Configuration
				-> VM Name/Region/Zone/Series/Machine Type
			-> OS and Storage
				-> Leave as default (Debian OS)
			-> Data Protection
				-> Leave as default
			-> Networking
				-> Firewall
					-> Allow HTTP traffic
					-> Allow HTTPS traffic
					-> Network tags
						-> http-server
						-> https-server
						-> add [jenkins] manually (will be used in firewall rules target tags)
					-> Hostname
						-> Leave as default / Set a custom hostname
			-> Observability
				-> Leave as default
			-> Security
				-> Leave as default
			-> Advanced
				-> Leave as default

		-> Configure VM 
			-> GCP Compute Engine.VM Instances
				-> External IP is used for access
				-> Click SSH under Connect
					-> SSH Terminal 
						-> run [sudo apt update] (Update system package list)
						-> run [sudo apt upgrade -y] (Upgrade existing packages)
						-> run [sudo apt install openjdk-17-jdk -y] (Install Java)
						-> run [sudo apt install git -y] (Install Git)
						-> run [java --version] (Verify Java Installation & version)
						-> run [git --version] (Verify Git Installation & version)
						-> run [curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null] (Download & install Jenkins GPG key for package verification)
						-> run [echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null] (Add Jenkins repository to your package sources)
						-> run [sudo apt update] (Update package list to recognize Jenkins repository)
						-> run [sudo apt install jenkins -y] (Install Jenkins)
						-> run [sudo systemctl enable jenkins] (Enable Jenkins)
						-> run [sudo systemctl start jenkins] (Start Jenkins)


		-> Add Firewall Rules
			-> GCP Network Security.Cloud NGFW.Firewall policies
				->  Create Firewall Rule
					-> Firewall Name/Description
					-> Logs: Off
					-> Network: default
					-> Priority: 1000
					-> Action on match: Allow
					-> Targets: Specified target tags
					-> Target Tags: [jenkins] (The same tag set in network tags)
					-> Source Filter: IPv4 ranges
					-> Source IPv4 ranges: 0.0.0.0/0 (Allow all internet traffics)
					-> Protocols and Ports
						-> Specified Protocols and Ports
							-> TCP
							-> 8080 (Jenkins run on Port 8080 by default)

