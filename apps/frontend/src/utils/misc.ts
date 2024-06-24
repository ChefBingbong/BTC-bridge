export const shortenAddress = (d: any, offset: number = 5) => {
  return `${d?.substring(0, offset)}...${d?.substring(d?.length - offset, d?.length)}`;
};
