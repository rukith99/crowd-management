import os
import pickle
import random
import numpy as np

event_path = os.path.join("encoders", "event_type_mapping.pkl")
country_path = os.path.join("encoders", "country_mapping.pkl")

with open(event_path, 'rb') as f:
    event_type_mapping = pickle.load(f)
with open(country_path, 'rb') as f:
    country_mapping = pickle.load(f)

class Support:
    def __init__(self):
        pass
    def encode_input(self,country,event_type):
        if country in country_mapping and event_type in event_type_mapping:
            encoded_country = country_mapping[country]
            encoded_event_type = event_type_mapping[event_type]
            return encoded_country,encoded_event_type
        else:
            return 0
    
    def make_denstiy_rate(self,prediction):

        values = list(prediction.values())
        keys = list(prediction.keys())

        entrance = abs(round(values[2]))  
        exit = abs(round(values[3]))       
        A = abs(round(values[4]))           
        B = abs(round(values[5]))           
        C = abs(round(values[6]))      

        tot = entrance+exit+A+B+C

        entrance = (entrance/tot*100)
        exit = (exit/tot*100)
        A = (A/tot*100)
        B = (B/tot*100)
        C = (C/tot*100)

        density_dict = {
            keys[2]: entrance,
            keys[3]: exit,
            keys[4]: A,         
            keys[5]: B,    
            keys[6]: C        
    }
        sorted_densticy_dict = dict(sorted(density_dict.items(), key=lambda item: item[1]))

        return sorted_densticy_dict
        # {'Dance Floor': 13.68, 'Kitchen': 15.65, 'Bar': 15.75, 'B': 17.82, 'Exit': 37.1}
    
    def filter_common_entries(self,results, sorted_density_dict):
        final_filtered_array = []
    
        for entry in results:
            coordinates, text, confidence_value = entry
        
            if text in sorted_density_dict:
                density_value = sorted_density_dict[text]
            
                final_filtered_array.append([coordinates, text, density_value])
        return final_filtered_array
    
    def validate_predictios():
        pass

    def process_outcomes(self,prediction,country,crowd,event_type):

        values = list(prediction.values())

        Fatalities = abs(round(prediction['Fatalities']))%10
        Injured = abs(round(prediction['Injured']))/10
        entrance = abs(round(values[2]))  
        exit = abs(round(values[3]))       
        A = abs(round(values[4]))           
        B = abs(round(values[5]))           
        C = abs(round(values[6]))    

        prediction = [Fatalities,Injured,entrance,exit,A,B,C]

        content_array=[]
        content_array.append(prediction)
        content_array.append(country)
        content_array.append(crowd)
        content_array.append(event_type)
        return content_array

    def split_number_to_parts(self,number):
        part1 = random.randint(1, 5)
        part2 = random.randint(1, 5)
        
        part3 = random.randint(100, 699)
        part4 = random.randint(100, 699)
        
        remaining_sum = int(number) - (part1 + part2 + part3 + part4)
        
        if remaining_sum < 3: 
            print("The number is too small to be split according to the given criteria.")
            return None
        
        part5 = random.randint(1, max(1, remaining_sum // 3))
        part6 = random.randint(1, max(1, (remaining_sum - part5) // 2))
        part7 = remaining_sum - (part5 + part6)
        # print([part1, part2, part3, part4, part5, part6, part7])
        prediction = [part1, part2, part3, part4, part5, part6, part7]
        return prediction 

    def process_for_llm(self,array,country,crowd,event_type):
        pass