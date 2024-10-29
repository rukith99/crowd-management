getting user input of all types
manage and assign inputs to relavant places

process and encode the data 
do the prediction and array conversion

create density rates
sort the array

run ocr and take resutls
filter the entries

validate outcome 
plot on image layer

send predictions and descritpion to the llm

input: data for model, event description and ground plan
output: predictions, heat map, suggestions


"**Crowd Management Optimization Suggestions:**\n\n**1. Enhance Entry and Exit Management:**\n\n* 
Increase the number of entry and exit points to reduce congestion. (Example: Increase exits from 4004 to 5000)\n* 
Implement crowd control barriers and directional signage to guide attendees.\n* Utilize technology like QR code 
scanners or RFID wristbands for expedited entry and contactless payments.\n\n**2. Optimize Venue Capacity Management:**\n\n* 
Establish clear maximum capacity limits and adhere to them strictly. (Example: Limit the number of attendees to 1800 instead 
of 2000)\n* Monitor crowd density in real-time using sensors or thermal imaging cameras.\n* Designate separate areas for 
different activities like restrooms, food vendors, and merchandise stalls to avoid overcrowding.\n\n**3. Improve Emergency 
Response:**\n\n* Establish a comprehensive emergency plan and train staff on crowd control procedures.\n* Provide adequate 
medical facilities and staff on-site. (Example: Increase medical staff from 17.3 reported injuries to 25)\n* Conduct regular 
crowd drills and simulations to prepare for potential incidents.\n\n**4. Enhance Communication and Information Sharing:**\n\n* 
Install clear signage throughout the venue with emergency contact numbers and evacuation routes.\n* Use social media and mobile 
apps to provide real-time updates and crowd management instructions.\n* Establish a central command center to coordinate crowd 
management efforts and respond to incidents effectively.\n\n**5. Promote Responsible Behavior:**\n\n* Encourage attendees to 
stay hydrated and wear comfortable clothing.\n* Prohibit alcohol consumption or excessive noise that can contribute to crowd 
disturbances.\n* Implement a zero-tolerance policy for disruptive or aggressive behavior.\n\n**6. Utilize Crowd Analytics:
**\n\n* Collect data on crowd demographics, movement patterns, and areas of congestion. (Example: Track movement from kitchen 
to stadium)\n* Use this data to identify potential areas of risk and optimize crowd management strategies.\n* Consider 
employing crowd simulation software to model crowd behavior and test different management scenarios."


    # density_array = support_instance.make_denstiy_rate(prediction)   #{'Entrance': 13.68, 'C': 15.65, 'A': 15.75, 'B': 17.82, 'Exit': 37.1}
    # print("2.0")
    # print(density_array)
    # extracted_resutls = service_instacne.extract_ocr()
    # print("3.0")
    # print(extracted_resutls)
    # # density_array = {'Dance Floor': 13.68, 'Bar': 15.65, 'A': 15.75, 'Kitchen': 17.82, 'Exit': 37.1}
    # final_array =support_instance.filter_common_entries(extracted_resutls,density_array)
    # print("4.0")
    # print(final_array)
    # byte = service_instacne.plot_heat_map(final_array)
    # print("5.0")
    # content_array = support_instance.process_outcomes(prediction,country,crowd_count,event_type)
    # print("6.0")
    # suggestions =service_instacne.generate_suggestions(content_array,description)
    # print("7.0")
    # return_array = [content_array[0],suggestions]
    # return return_array