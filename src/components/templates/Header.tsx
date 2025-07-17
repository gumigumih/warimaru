import warimaruSvg from "../../assets/logo-white.svg";

export const Header = () => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <img src={warimaruSvg} alt="わりまる" className="w-1/2" />
      </div>
      <p className="text-center text-white mb-8 text-shadow-2xl">
        飲み会や旅行の支払いを
        <br />
        簡単に計算できます。
        <br />
        誰がいくら払ったか入力するだけで
        <br />
        精算金額が自動計算！
      </p>
    </>
  );
};
