Esp32 Scale App

This is a placeholder for app code. WIP!

This will have the following functionality

1. An endpoint that will receive weight and impedance data from a device.
1. Allow setup of user profiles, including height, age, and last measured lean body mass (LBM) coefficient.
1. Logic that will view incoming data, guess which user from a profile it belongs to based on last measured LBM, assign it to that user's profile, and generate body metrics based on a combination of that weight and profile data
1. A tool that will allow someone to re-assign a measurement to another user in case the guess was wrong.

1. Start an EC2 instance using amazon linux
1. Install postgres with `sudo amazon-linux-extras install postgresql12`
1. Install node with the following https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

Users table - height is in CM. Weight is in whatever, it has a separate units column although it should probably be kgs

Users table needs some basic metrics like dob and height to start calculating metrics. 

The metrics calculations used are based on a biological sex binary that is non inclusive of the spectrum of gender or of people's lived experiences. I have no idea what the source of the calculations are prior to the [xiaomi_mi_scale github repository](https://github.com/lolouk44/xiaomi_mi_scale) and I lack the knowledge to alter these calculations to anything other than what is provided. Users should select male or female based on an estimation on how their hormonal makeup will affect the muscle, bone and fat mass in their bodies. Please submit an issue if you have any ideas on how to make usage of this application more inclusive with the limitations of the source material and measurements provided by the scale.