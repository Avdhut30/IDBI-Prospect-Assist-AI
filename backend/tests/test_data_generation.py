from pandas.testing import assert_frame_equal

from dataset.generate_synthetic_banking_data import generate_customers


def test_generated_customers_are_valid_and_reproducible() -> None:
    first = generate_customers(rows=250, seed=7)
    second = generate_customers(rows=250, seed=7)

    assert first.shape == (250, 32)
    assert first["customer_id"].is_unique
    assert not first.isna().any().any()
    assert first["age"].between(21, 70).all()
    assert first["cibil_score"].between(300, 900).all()
    assert set(first["loan_accepted"].unique()) == {0, 1}
    assert_frame_equal(first, second)
