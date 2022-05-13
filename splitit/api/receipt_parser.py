from google.cloud import vision
import re


class ReceiptParser():
    def hello():
        print("hello receipt parser")

    def parseTest(parsed):
        parsed = [
            ('6 Wings', '$6.99'),
            ('Kai mousse', '$9.99'),
            ('Gwyneth dango', '$14.49'),
            ('Subtotal', '$31.97'),
            ('Tax', '$1.44'),
            ('Total', '$33.41'),
            ('Amount Paid', '$7.43'),
            ('$1.50 18% -', '$1.80'),
            ('20% $2.00 25% -', '$2.50')
        ]
        items = []
        tax = 0
        total = 0
        for item in parsed:
            if item[0].lower().startswith('tax'):
                tax = item[1]
                tax = tax.replace('$', '')
                tax = tax.replace(',', '')
            elif item[0].lower().startswith('total'):
                total = item[1]
                total = total.replace('$', '')
                total = total.replace(',', '')
                break
            elif not item[0].lower().startswith('subtotal'):
                itemPrice = item[1]
                itemPrice = itemPrice.replace('$', '')
                itemPrice = itemPrice.replace(',', '')
                itemDict = {'name': item[0], 'price': itemPrice}
                items.append(itemDict)

        print("items: ", items)
        print("tax: ", tax)
        print("total: ", total)
        return {'tax': tax, 'total': total, 'items': items}

    def parseImage(imageFile):
        return ReceiptParser.parseTest(1)
        client = vision.ImageAnnotatorClient()
        content = imageFile.read()
        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        # print(response)

        # response.text_annotations.sort(key=lambda anot: anot.bounding_poly.vertices[0].y)
        # [x.description for x in response.text_annotations[18:30]]
        def get_description(items):
            return [x.description for x in items]

        # bounding_poly.vertices: {0:topleft 1:topright 2:botright 3:botleft}
        x_min = min([x.bounding_poly.vertices[0].x for x in response.text_annotations])
        x_max = max([x.bounding_poly.vertices[1].x for x in response.text_annotations])
        x_left = x_min + ((x_max-x_min)*2 / 3)
        x_right = x_min + ((x_max-x_min)*2 / 3)
        left_items = [x for x in response.text_annotations if x.bounding_poly.vertices[0].x < x_left]
        right_items = [x for x in response.text_annotations if x.bounding_poly.vertices[1].x > x_right]
        # print(get_description(left_items))
        # print(get_description(right_items))

        price_regex = re.compile(r'(USD|EUR|€|\$)?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(USD|EUR|€|\$)')
        prices = [price for price in right_items if price_regex.match(price.description)]

        def dish_get_name(dish):
            # TODO: expand to include neighboring words
            return dish.description

        def get_mid_y(item):
            vertices = item.bounding_poly.vertices
            return (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4

        def get_mid_x(item):
            vertices = item.bounding_poly.vertices
            return (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4

        dish_price = []
        for price in prices:
            mid_y_price = get_mid_y(price)
            mid_x_price = get_mid_x(price)
            min_y_delta = float('inf')
            dish = 0
            for item in left_items:
                mid_y_item = get_mid_y(item)
                delta = abs(mid_y_item - mid_y_price)
                if delta < min_y_delta:
                    dish = item
                    min_y_delta = delta
            mid_y_dish = get_mid_y(dish)
            mid_x_dish = get_mid_x(dish)
            slope = (mid_y_dish - mid_y_price) / (mid_x_dish - mid_x_price)
            b = mid_y_dish - (slope * mid_x_dish)
            dish_name = []
            for item in left_items:
                if len(item.description) > 100:
                    continue
                item_x = (item.bounding_poly.vertices[0].x + item.bounding_poly.vertices[1].x)/2
                max_item_y = item.bounding_poly.vertices[3].y
                min_item_y = item.bounding_poly.vertices[0].y
                expected_item_y = (slope * item_x) + b
                if expected_item_y <= max_item_y and expected_item_y >= min_item_y:
                    dish_name.append(dish_get_name(item))
            dish_price.append((" ".join(dish_name), price.description))

        def print_dish_price(dish_price):
            [print(x) for x in dish_price]

        print_dish_price(dish_price)
        return ReceiptParser.parseTest(dish_price)

