"use client"
import React, { useState } from "react";
import NiceSelect from "@/ui/nice-select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/utils/utils";

const EmployShortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort');
  const [active, setActive] = useState(sort || '');
  // handleShort
  const handleShort = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'sort',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'sort',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <NiceSelect
      options={[
        { value: "New", label: "New" },
        { value: "Old", label: "Old" },
        { value: "Name", label: "Name" },

        // { value: "Active", label: "Active" },
        // { value: "Pending", label: "Pending" },
        // { value: "Expired", label: "Expired" },
      ]}
      defaultCurrent={0}
      onChange={(item) => handleShort(item)}
      name="Short by"
    />
  );
};

export default EmployShortSelect;
