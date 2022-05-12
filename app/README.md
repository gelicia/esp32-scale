Esp32 Scale App

This is a placeholder for app code. WIP!

This will have the following functionality

1. An endpoint that will receive weight and impedance data from a device.
1. Allow setup of user profiles, including height, age and sex (see note below). 
1. Logic that will view incoming data, guess which user from a profile it belongs to based on last measured LBM, assign it to that user's profile, and generate body metrics based on a combination of that weight and profile data. It will update the user profile to have a last measured weight and LBM for use in future guesses.
1. A tool that will allow someone to re-assign a measurement to another user in case the guess was wrong. Reassigning a measurement will update both users' profiles.
1. Pretty charts showing body composition changes over time with no "ideal/goal" metrics.

---

Server method

1. Start an EC2 instance using amazon linux
1. Install postgres with `sudo amazon-linux-extras install postgresql12`
1. Install node with the following https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
1. Postgres schema creation script is at `server/scripts/schema.sql`. You will need to create one entry in the users table.

---

Lambda method

1. Use RDS to host a Postgres instance.
1. Postgres schema creation script is at `server/scripts/schema.sql`. You will need to create one entry in the users table.
1. In the `app/lambda/measurement` folder, run `npm i` to bring in the database library. Zip this to a file
1. Create a lambda function that is exposed as an endpoint via the API gateway. 
1. Overwrite boilerplate lambda code by importing the zipped file.
1. Create an authorizer lambda for API gateway. The code for it is in `app/lambda/measurementAuthorizer` You will want to choose a key and be sure the hardware code is sending it in as the `authToken`. 
1. Create a cloudfront distribution that will let you access the endpoint above without https. This is done because trying to access HTTPS endpoints on the ESP32 is difficult.

---

Users table - height is in CM. Weight is in whatever, it has a separate units column. 

Users table needs some basic metrics like dob and height to start calculating metrics.

Measurements table stores weight into KGs to be standardized. 

The metrics calculations used are based on a biological sex binary that is non inclusive of the spectrum of gender and of people's lived experiences. I have no idea what the source of the calculations are prior to the [xiaomi_mi_scale github repository](https://github.com/lolouk44/xiaomi_mi_scale) and I lack the knowledge to alter these calculations to be anything other than what is provided. Users should select male or female based on an estimation on how their hormonal makeup will affect the muscle, bone and fat composition of their bodies. Please submit an issue if you have any ideas on how to make usage of this application more inclusive with the limitations of the source material and measurements provided by the scale.