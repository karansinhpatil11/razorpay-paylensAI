const Payment = require("../models/Payment");

const getAnalytics = async (req, res) => {
  try {
    // 1. Summary
    const summaryResult = await Payment.aggregate([
      {
        $group: {
          _id: null,

          totalPayments: { $sum: 1 },

          successfulPayments: {
            $sum: {
              $cond: [
                { $eq: [{ $toUpper: "$status" }, "SUCCESS"] },
                1,
                0
              ]
            }
          },

          failedPayments: {
            $sum: {
              $cond: [
                { $eq: [{ $toUpper: "$status" }, "FAILED"] },
                1,
                0
              ]
            }
          },

          totalAmount: {
            $sum: "$amount"
          }
        }
      }
    ]);

    const summary = summaryResult[0] || {
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmount: 0
    };

    // 2. Failure rate
    const failureRate =
      summary.totalPayments > 0
        ? Number(
            (
              (summary.failedPayments / summary.totalPayments) *
              100
            ).toFixed(2)
          )
        : 0;

    // 3. Payment status distribution
    const status = await Payment.aggregate([
      {
        $group: {
          _id: {
            $toUpper: "$status"
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ]);

    // 4. Failures by bank
    const banks = await Payment.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toUpper: "$status" }, "FAILED"]
          }
        }
      },
      {
        $group: {
          _id: "$bank",
          failures: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          bank: "$_id",
          failures: 1
        }
      },
      {
        $sort: {
          failures: -1
        }
      }
    ]);

    // 5. Failures by payment method
    const methods = await Payment.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toUpper: "$status" }, "FAILED"]
          }
        }
      },
      {
        $group: {
          _id: "$method",
          failures: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          method: "$_id",
          failures: 1
        }
      },
      {
        $sort: {
          failures: -1
        }
      }
    ]);

    // Final response
    res.status(200).json({
      summary: {
        totalPayments: summary.totalPayments,
        successfulPayments: summary.successfulPayments,
        failedPayments: summary.failedPayments,
        totalAmount: summary.totalAmount,
        failureRate
      },

      status,

      banks,

      methods
    });

  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics
};