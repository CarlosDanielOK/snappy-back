import { Controller, Post, Param, ParseUUIDPipe, Get, Query, UseGuards } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PurchasesService } from "./purchases.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { subscriptionRangeDTO } from "./dto/purchases.dto";
import { userRole } from "src/users/entities/user.entity";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly purchasesService: PurchasesService,
    ) { }

    @Post('subscribe/:id')
    @ApiOperation({ summary: 'Create Purchases' })
    @ApiCreatedResponse({
        description: 'Created Purchases',
        schema: {
            example: {
                "url": "https://checkout.stripe.com/c/pay/cs_test_a1k45QVEjAQ7gCWgA3v5Alw47C4MiZ4Tpp9bYUf4Kf73NxIO0okh8PiMnU#fidkdWxOYHwnPyd1blpxYHZxWjA0VF1VfG5EYmIyX2JRQWI3R0RBanwxVV1IUn9mdjxUd1VdPVROdkFcN2NKPTQ3TXFDQ0BOf0l2Tk9KMH9MVUx8PEQwUTU2a3BcMnRCVEd2amM2akJST2djNTVEPEhzUnJcVycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
            }
        }
    })
    @ApiNotFoundResponse({
        description: 'User Not Found ',
        schema: {
            example: {
                "message": "El usuario no existe",
                "error": "Not Found",
                "statusCode": 404
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Error: Bad Request.',
        schema: {
            example: {
                "message": "Validation failed (uuid is expected)",
                "error": "Bad Request",
                "statusCode": 400
            }
        }
    })
    async createSubscription(@Param('id', ParseUUIDPipe) userId: string) {
        const amount = 10;

        const session = await this.stripeService.createCheckoutSession(amount, userId);

        await this.purchasesService.createPendingPurchase(userId, amount, session.id);

        return { url: session.url };
    }

    @Post('subscribe/success/:sessionId')
    async successSubscription(@Param('sessionId') sessionId: string) {
        return await this.purchasesService.completePurchase(sessionId);
    }

    @Get('user/:id')
    async getSubscriptionByUser(@Param('id', ParseUUIDPipe) userId: string) {
        return this.purchasesService.getSubscriptionByUser(userId);
    }

    @ApiBearerAuth()
    @Roles(userRole.ADMIN, userRole.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async getSubscriptions() {
        return this.purchasesService.getSubscriptions();
    }

    @Get('/metrics')
    async getSubscriptionsRange(@Query() subscriptionRange: subscriptionRangeDTO) {
        return this.purchasesService.getSubscriptionsRange(subscriptionRange);
    }
}