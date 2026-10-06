declare module "sslcommerz-lts" {
	interface SSLCommerzPaymentOptions {
		total_amount: number;
		currency: string;
		tran_id: string;
		success_url: string;
		fail_url: string;
		cancel_url: string;
		ipn_url?: string;
		shipping_method: string;
		product_name: string;
		product_category: string;
		product_profile: string;

		cus_name: string;
		cus_email: string;
		cus_add1: string;
		cus_city: string;
		cus_state: string;
		cus_postcode: string;
		cus_country: string;
		cus_phone: string;

		ship_name: string;
		ship_add1: string;
		ship_city: string;
		ship_state: string;
		ship_postcode: string;
		ship_country: string;
	}

	interface SSLCommerzInitResponse {
		GatewayPageURL?: string;
		status?: string;
		statusMessage?: string;
		[key: string]: unknown;
	}

	interface SSLCommerzValidationResponse {
		status?: string;
		tran_id?: string;
		amount?: string;
		currency?: string;
		[key: string]: unknown;
	}

	class SSLCommerzPayment {
		constructor(
			storeId: string,
			storePassword: string,
			isLive?: boolean,
		);

		init(
			data: SSLCommerzPaymentOptions,
		): Promise<SSLCommerzInitResponse>;

		validate(data: {
			val_id: string;
		}): Promise<SSLCommerzValidationResponse>;
	}

	export = SSLCommerzPayment;
}