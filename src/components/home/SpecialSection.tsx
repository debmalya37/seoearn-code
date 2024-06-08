import Image from 'next/image';
import pic from "../../../asset/4.png";
const SpecialSection = () => {
  return (
    <div className="mb-20">
      <p className="font-bold">Specially for you:</p>
      <div className="flex items-center">
        <Image src={pic} alt="Earnings Image" width={100} height={100} />
        <ul className="ml-5 list-disc">
          <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
          <li>A typical you can influence to help users decide.</li>
          <li>A typical you can influence to help users decide whether they should visit.</li>
          <li>A typical you can influence to help users decide whether they should visit your site through.</li>
        </ul>
      </div>
    </div>
  );
};

export default SpecialSection;
