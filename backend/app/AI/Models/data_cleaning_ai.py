import re

def clean_price(price_text):
    if isinstance(price_text, str):
        price_text = re.sub(r'[\s\u202f\u00a0]', '', price_text)
        prices = list(map(int, re.findall(r'\d+', price_text)))
        if len(prices) == 1:
            return prices[0]
        elif len(prices) > 1:
            return sum(prices) // len(prices)
    return 0

def clean_area(area_text):
    if isinstance(area_text, str):
        match = re.search(r'(\d+(?:[\.,]\d+)?)', area_text)
        if match:
            return float(match.group(1).replace(',', '.'))
    return 80.0

def clean_rooms(rooms_text):
    if isinstance(rooms_text, str):
        match = re.search(r'(\d+)', rooms_text)
        if match:
            return int(match.group(1))
    return 2

