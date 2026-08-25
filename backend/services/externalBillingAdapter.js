/**
 * External Billing Counter Integration Adapter (Stage 3 Placeholder)
 * 
 * This service module decouples internal MHP billing generation from future
 * external billing-counter API synchronization, webhooks, and third-party invoice providers.
 * 
 * IMPORTANT:
 * - NO real external API requests are performed in this stage.
 * - Future credentials (API Keys, Secrets) will be loaded from environment variables.
 */

async function syncToExternalBilling(billRecord, orderRecord) {
  try {
    const apiKey = process.env.EXTERNAL_BILLING_API_KEY;
    const apiUrl = process.env.EXTERNAL_BILLING_API_URL;

    // Check if external billing API credentials are configured
    if (!apiKey || !apiUrl) {
      return {
        success: true,
        synced: false,
        status: 'LOCAL_ONLY',
        message: 'Internal billing record created. Awaiting external MHP billing-counter API credentials.',
        timestamp: new Date().toISOString()
      };
    }

    // Future External API sync execution (to be enabled when credentials provided in later stage)
    // const payload = prepareExternalPayload(billRecord, orderRecord);
    // const response = await fetch(apiUrl, { method: 'POST', headers: { ... }, body: JSON.stringify(payload) });

    return {
      success: true,
      synced: false,
      status: 'LOCAL_ONLY',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('External billing sync adapter error:', err);
    return {
      success: false,
      synced: false,
      status: 'EXTERNAL_FAILED',
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

function prepareExternalPayload(billRecord, orderRecord) {
  return {
    billingNumber: billRecord.billingNumber,
    orderId: billRecord.orderId,
    orderNumber: billRecord.orderNumber,
    studentId: billRecord.studentId,
    customerName: billRecord.customerName,
    customerPhone: billRecord.customerPhone,
    orderType: billRecord.orderType,
    items: billRecord.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice || item.price,
      option: item.selectedOptionLabel || null
    })),
    subtotal: billRecord.subtotal,
    parcelCharge: billRecord.parcelCharge,
    totalAmount: billRecord.total,
    paymentMethod: billRecord.paymentMethod || 'UPI',
    paymentStatus: billRecord.paymentStatus || 'PAID',
    createdAt: billRecord.createdAt
  };
}

module.exports = {
  syncToExternalBilling,
  prepareExternalPayload
};
