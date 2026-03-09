import pytest
from Sources.Checkout import Checkout

def test_checkout():
    checkout: Checkout = Checkout()
    assert isinstance(checkout, Checkout)

def test_add_article_and_price():
    checkout = Checkout()
    checkout.add_article("banana")
    checkout.set_article_price("banana", 2)
    assert ("banana" in checkout.articles_and_price) == True
    assert checkout.articles_and_price["banana"] == 2

def test_add_many_articles():
    checkout: Checkout = Checkout()
    articles: [str] = ["banana", "apple", "orange"]
    prices: [float] = [3, 1, 2]
    checkout.add_article(articles)

    for item, price in zip(articles, prices):
        checkout.set_article_price(item, price)

    for item, price in zip(articles, prices):
        assert (item in checkout.articles_and_price) == True
        assert checkout.articles_and_price[item] == price

def test_exception_article_already_added():
    checkout = Checkout()
    checkout.add_article("orange")
    # We test that a exception is rise
    with pytest.raises(NameError):
        checkout.add_article("orange")

def test_exception_missing_price():
    checkout = Checkout()
    # We test that a exception is risen
    with pytest.raises(NameError):
        checkout.set_article_price("orange", 4)

def test_calculate_total_simple():
    checkout = Checkout()
    checkout.add_article(["apple", "banana"])
    checkout.set_article_price("apple", 2.0)
    checkout.set_article_price("banana", 3.0)

    basket = ["apple", "apple", "banana"]
    assert checkout.calculate_total(basket) == 7.0


def test_discount_rules():
    checkout = Checkout()
    checkout.add_article("apple")
    checkout.set_article_price("apple", 2.0)
    # Rule : 3 Apple at 5.0 rather than 6.0
    checkout.add_discount_rule("apple", 3, 5.0)

    assert checkout.calculate_total(["apple", "apple", "apple"]) == 5.0
    assert checkout.calculate_total(["apple", "apple", "apple", "apple"]) == 7.0

