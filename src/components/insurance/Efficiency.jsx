import React from "react";

const Efficiency = () => {
  return (
    <div className="containerr h-fit">
      <h2 className="subtitle text-center">
        Built for the Complexity
        <br />
        of the Insurance Industry 
      </h2>
      <p className="content text-center pt-[2vw]">
        insurAInce is proven across diverse insurance environments to
        <br />
        drive speed, efficiency, and accuracy where it counts the most. 
      </p>

      <div className="w-full flex justify-between items-start pt-[5vw]">
        {/* Stat 1 */}
        <div className="flex flex-col items-start gap-[1vw] w-[20%]">
          <h2 className="bg-gradient-to-r from-[#F16B0D] to-[#E61216] bg-clip-text text-transparent text-[4.2vw] font-body font-semibold ">
            50%
          </h2>
          <p className="content tracking-wider leading-[1.4]">
            faster time to market for AI and GenAI use cases
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-start gap-[1vw] w-[20%]">
          <h2 className="bg-gradient-to-r from-[#F16B0D] to-[#E61216] bg-clip-text text-transparent text-[4.2vw] font-body font-semibold ">
            60%
          </h2>
          <p className="content tracking-wider leading-[1.4]">
            reduction in TCO
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-start gap-[1vw] w-[20%]">
          <h2 className="bg-gradient-to-r from-[#F16B0D] to-[#E61216] bg-clip-text text-transparent text-[4.2vw] font-body font-semibold ">
            80%
          </h2>
          <p className="content leading-[1.4] tracking-wider">
            drop in manual tasks across claims and servicing
          </p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-start gap-[1vw] w-[20%]">
          <h2 className="bg-gradient-to-r from-[#F16B0D] to-[#E61216] bg-clip-text text-transparent text-[4.2vw] font-body font-semibold ">
            30
          </h2>
          <p className="content  leading-[1.4] tracking-wider">
            days or less to go live with AI use cases & GenAI in hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default Efficiency;



