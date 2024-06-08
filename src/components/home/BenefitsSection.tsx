import Image from 'next/image';
import pic from "../../../asset/3.png";
const BenefitsSection = () => {
  return (
    <div className="mb-20">
      <p className="font-bold">Your Benefits:</p>
      <div className="flex items-center">
        <ul className="ml-5 list-disc">
          <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
          <li>A typical you can influence to help users decide.</li>
          <li>A typical you can influence to help users decide whether they should visit.</li>
          <li>A typical you can influence to help users decide whether they should visit your site through.</li>
        </ul>
        <Image src={pic} alt="Benefits Image" width={100} height={100} className="ml-auto" />
      </div>
    </div>
  );
};

export default BenefitsSection;
