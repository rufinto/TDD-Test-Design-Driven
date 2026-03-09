from enum import Enum

class Error(Enum):
    article_already_present = "article already present"
    article_not_present = "article not present"
    prize_article_already_present = "article price already present"
    price_article_not_definied = "article prices not definied"

    def label(self, article: str):
        return f"{article} " + Error.prize_article_already_present.value

class Checkout:

    def __init__(self):
        self.articles_and_price = {}
        self.reductions = {}

    def add_article(self, article: str):
        # if article is a list of item
        if isinstance(article, list):
            for item in article:
                self.add_article(item)
        # if article is one item
        else:
            if article in self.articles_and_price:
                raise NameError(Error.article_already_present.label)
            self.articles_and_price[article] = None

    def set_article_price(self, article: str, prize: float):
        if article not in self.articles_and_price:
            raise NameError(Error.article_not_present.label)
        elif self.articles_and_price[article] is not None:
            raise NameError(Error.prize_article_already_present.label)
        else:
            self.articles_and_price[article] = prize

    def add_discount_rule(self, article: str, quantity: int, discount_price: float):
        """add a rule : 'if we have X items, the batch cost Y """
        self.reductions[article] = (quantity, discount_price)

    def calculate_total(self, basket: list):
        total = 0
        from collections import Counter
        counts = Counter(basket)

        for article, count in counts.items():
            if article not in self.articles_and_price or self.articles_and_price[article] is None:
                raise NameError(Error.price_article_not_definied.label)

            # Apply discounts
            if article in self.reductions:
                qty, special_price = self.reductions[article]
                num_specials = count // qty
                remainder = count % qty
                total += (num_specials * special_price) + (remainder * self.articles_and_price[article])
            else:
                total += count * self.articles_and_price[article]

        return total


