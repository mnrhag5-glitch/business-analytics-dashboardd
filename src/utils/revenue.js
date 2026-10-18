
export const isCompletedPayment = (payment) =>
  payment?.status === "Completed";

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

export const getCollectedAmount = (payments = []) =>
  payments
    .filter(isCompletedPayment)
    .reduce((total, payment) => total + toAmount(payment.amount), 0);

export const getOrderPaidAmount = (orderId, payments = []) =>
  getCollectedAmount(
    payments.filter((payment) => payment.orderId === orderId),
  );

export const getOrderOutstanding = (order, payments = []) => {
  const orderAmount = toAmount(order?.amount);
  const paid = getOrderPaidAmount(order?.id, payments);

  return Math.max(0, orderAmount - paid);
};

export const getDealCollectedAmount = (dealId, payments = []) =>
  getCollectedAmount(
    payments.filter((payment) => payment.dealId === dealId),
  );

export const getDealOutstanding = (deal, payments = []) => {
  const dealValue = toAmount(deal?.value);
  const collected = getDealCollectedAmount(deal?.id, payments);

  return Math.max(0, dealValue - collected);
};

export const getOutstandingAmount = (orders = [], payments = []) =>
  orders.reduce(
    (total, order) => total + getOrderOutstanding(order, payments),
    0,
  );

export const getCompletedPaymentCount = (payments = []) =>
  payments.filter(isCompletedPayment).length;

export const getPaymentStatusTotals = (payments = []) =>
  payments.reduce(
    (result, payment) => {
      const amount = toAmount(payment.amount);

      if (payment.status === "Completed") {
        result.completed += amount;
      } else if (payment.status === "Pending") {
        result.pending += amount;
      } else if (payment.status === "Failed") {
        result.failed += amount;
      }

      return result;
    },
    { completed: 0, pending: 0, failed: 0 },
  );
