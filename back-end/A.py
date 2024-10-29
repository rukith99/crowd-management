import easyocr

reader = easyocr.Reader(['en'])
result = reader.readtext('plan_1111.jpg')
print(result)